package com.hrms.scheduler;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.hrms.dao.AttendanceDao;
import com.hrms.dao.CompanyDao;
import com.hrms.dao.PayslipDao;
import com.hrms.dao.UserDao;
import com.hrms.entity.Attendance;
import com.hrms.entity.Company;
import com.hrms.entity.Employee;
import com.hrms.entity.Payslip;
import com.hrms.entity.User;
import com.hrms.utility.Constants.ActiveStatus;
import com.hrms.utility.Constants.AttendanceStatus;
import com.hrms.utility.Constants.CompanyStatus;
import com.hrms.utility.Constants.UserRole;
import com.hrms.utility.Constants.WorkingStatus;

import jakarta.annotation.PreDestroy;

@Component
public class PaySlipScheduler {

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private AttendanceDao attendanceDao;

	@Autowired
	private PayslipDao payslipDao;

	@Autowired
	private UserDao userDao;

	private final ExecutorService executorService = Executors.newFixedThreadPool(10);

	private final Logger LOG = LoggerFactory.getLogger(PaySlipScheduler.class);

	//@Scheduled(cron = "0 * * * * ?") // every minute
//	@Scheduled(cron = "0 0 2 1 * ?") // Runs at 2 AM on the 1st day of every month
	public void paySlipGeneration() {
		LOG.info("Pay Slip Scheduler Starting on thread: {}", Thread.currentThread().getName());

		LocalDate firstDayOfMonth = LocalDate.now();

		// we have to calculate it for April month
		if (firstDayOfMonth.getDayOfMonth() != 1) {   // May
			LOG.info("Today is not the first day of month!!!");
			return;
		}

		LocalDate yesterday = firstDayOfMonth.minusDays(1);   // from month April

		List<Company> companies = companyDao.findByStatus(CompanyStatus.ACTIVE.value());

		if (CollectionUtils.isEmpty(companies)) {
			LOG.info("No Active Companies found! Scheduler stopped.");
			return;
		}

		companies.forEach(company -> processCompanyEmployeePaySlipGeneration(company, yesterday));

		LOG.info("Pay Slip Scheduler Stopped...");
	}

	private void processCompanyEmployeePaySlipGeneration(Company company, LocalDate date) {
		LOG.info("Processing payslip generation for company: {} on thread: {}", company.getName(),
				Thread.currentThread().getName());

		List<User> employees = this.userDao.findByRoleAndStatusAndCompanyId(UserRole.ROLE_COMPANY_EMPLOYEE.value(),
				ActiveStatus.ACTIVE.value(), company.getId());

		if (CollectionUtils.isEmpty(employees)) {
			LOG.info("No active employees found for company: {}", company.getName());
			return;
		}

		// Submit a task for each employee's payslip generation
		employees.forEach(employee -> {
			if (employee.getEmployee() != null) {
				executorService.submit(() -> {
					try {
						processEmployeePaySlipGeneration(employee, date);
					} catch (Exception e) {
						LOG.error("Error processing payslip for employee: {} - {}", employee.getId(), e.getMessage());
					}
				});
			} else {
				LOG.error("Skipping payslip generation: Employee entity is null for user: {}", employee.getId());
			}
		});
	}

	private void processEmployeePaySlipGeneration(User employee, LocalDate date) {
		LOG.info("Generating payslip for employee: {} on thread: {}", employee.getId(),
				Thread.currentThread().getName());

		String salaryMonth = getYearMonth(date.toString());

		// Fetch employee's attendance for the month
		List<Attendance> attendances = attendanceDao.findByEmployeeUserAndDateContainingIgnoreCaseAndWorkingStatus(
				employee, salaryMonth, WorkingStatus.WORKING.value());

		if (CollectionUtils.isEmpty(attendances)) {
			LOG.info("No attendance found for employee: {} in month: {}", employee.getEmployee().getId(),
					date.getMonth().toString());
			return;
		}

		// Calculate the payslip based on attendance data
		double totalWorkingDays = attendances.size();
		double totalDaysInMonth = date.lengthOfMonth();
		double daysPresent = calculateTotalPresentDays(attendances);
		double daysAbsent = calculateTotalAbsentDays(attendances);
		double extraWorkingDays = 0.0;

		Employee userEmployee = employee.getEmployee();

		// Create and save the payslip
		Payslip payslip = new Payslip();

		// Set Employee details (this could be from employee object)
		payslip.setEmployee(employee.getEmployee());
		payslip.setEmployeeCode(userEmployee.getEmployeeCode());
		payslip.setFullName(employee.getFirstName() + " " + employee.getLastName()); // Full name
		payslip.setDesignationName(userEmployee.getDesignation().getName()); // Designation
		payslip.setDepartmentName(userEmployee.getDepartment().getName()); // Department

		// Set the calculated values to the Payslip
		payslip.setTotalDaysInMonth(totalDaysInMonth);
		payslip.setTotalWorkingDays(totalWorkingDays);
		payslip.setDaysPresent(daysPresent);
		payslip.setDaysAbsent(daysAbsent);
		payslip.setExtraWorkingDays(extraWorkingDays);

		// Set adjustments for extra working days (from Employee table)
		payslip.setExtraDayPayBase(userEmployee.getExtraDayPayBase()); // Example adjustment
		payslip.setExtraDayPayHra(userEmployee.getExtraDayPayHra());
		payslip.setExtraDayPayConveyanceAllowance(userEmployee.getExtraDayPayConveyanceAllowance());
		payslip.setExtraDayPayRetentionAllowance(userEmployee.getExtraDayPayRetentionAllowance());
		payslip.setExtraDayPayPf(userEmployee.getExtraDayPayPf());
		payslip.setExtraDayPayTds(userEmployee.getExtraDayPayTds());

		// Set deductions for absent days (from Employee table)
		payslip.setAbsentDayPayBase(userEmployee.getAbsentDayPayBase()); // Example deduction
		payslip.setAbsentDayPayHra(userEmployee.getAbsentDayPayHra());
		payslip.setAbsentDayPayConveyanceAllowance(userEmployee.getAbsentDayPayConveyanceAllowance());
		payslip.setAbsentDayPayRetentionAllowance(userEmployee.getAbsentDayPayRetentionAllowance());
		payslip.setAbsentDayPayPf(userEmployee.getAbsentDayPayPf());
		payslip.setAbsentDayPayTds(userEmployee.getAbsentDayPayTds());

		// Set Bank details (Snapshot from Employee, or another source)
		payslip.setBankName(userEmployee.getBankName());
		payslip.setBankAccountNumber(userEmployee.getBankAccountNumber());
		payslip.setIfscCode(userEmployee.getIfscCode());

		// Set Month and Year
		payslip.setMonth(date.getMonth().toString()); // JANUARY will be converted to "JANUARY"
		payslip.setYear(date.getYear()); // YYYY, e.g., 2024

		// Set Salary Components (from Employee table)
		payslip.setCtc(userEmployee.getCtc());
		payslip.setBasicSalary(userEmployee.getBasicSalary());
		payslip.setHra(userEmployee.getHra());
		payslip.setLta(userEmployee.getLta());
		payslip.setConveyanceAllowance(userEmployee.getConveyanceAllowance());
		payslip.setRetentionAllowance(userEmployee.getRetentionAllowance());
		payslip.setMobileAllowance(userEmployee.getMobileAllowance());
		payslip.setProvidentFund(userEmployee.getProvidentFund());
		payslip.setProfessionTax(userEmployee.getProfessionTax());
		payslip.setTds(userEmployee.getTds());

		// Declare the calculated variables
		BigDecimal calculatedBasicSalary = BigDecimal.ZERO;
		BigDecimal calculatedHra = BigDecimal.ZERO;
		BigDecimal calculatedConveyanceAllowance = BigDecimal.ZERO;
		BigDecimal calculatedRetentionAllowance = BigDecimal.ZERO;
		BigDecimal calculatedProvidentFund = BigDecimal.ZERO;
		BigDecimal calculatedTds = BigDecimal.ZERO;
		BigDecimal lta = userEmployee.getLta(); // Assuming lta is calculated elsewhere if required
		BigDecimal mobileAllowance = userEmployee.getMobileAllowance(); // Assuming mobileAllowance is calculated
																		// elsewhere if required
		BigDecimal professionTax = userEmployee.getProfessionTax(); // Assuming professionTax is provided or calculated
																	// elsewhere

		// Deductions for absent days (subtract from actual components)
		if (daysAbsent > 0.0) {
			calculatedBasicSalary = userEmployee.getBasicSalary()
					.subtract(userEmployee.getAbsentDayPayBase().multiply(BigDecimal.valueOf(daysAbsent)));

			calculatedHra = userEmployee.getHra()
					.subtract(userEmployee.getAbsentDayPayHra().multiply(BigDecimal.valueOf(daysAbsent)));

			calculatedConveyanceAllowance = userEmployee.getConveyanceAllowance().subtract(
					userEmployee.getAbsentDayPayConveyanceAllowance().multiply(BigDecimal.valueOf(daysAbsent)));

			calculatedRetentionAllowance = userEmployee.getRetentionAllowance().subtract(
					userEmployee.getAbsentDayPayRetentionAllowance().multiply(BigDecimal.valueOf(daysAbsent)));

			calculatedProvidentFund = userEmployee.getProvidentFund()
					.subtract(userEmployee.getAbsentDayPayPf().multiply(BigDecimal.valueOf(daysAbsent)));

			calculatedTds = userEmployee.getTds()
					.subtract(userEmployee.getAbsentDayPayTds().multiply(BigDecimal.valueOf(daysAbsent)));
		} else {
			// If no days are absent, just assign the values from the employee
			calculatedBasicSalary = userEmployee.getBasicSalary();
			calculatedHra = userEmployee.getHra();
			calculatedConveyanceAllowance = userEmployee.getConveyanceAllowance();
			calculatedRetentionAllowance = userEmployee.getRetentionAllowance();
			calculatedProvidentFund = userEmployee.getProvidentFund();
			calculatedTds = userEmployee.getTds();
		}

		// Set the calculated salary components in the payslip
		payslip.setCalculatedBasicSalary(calculatedBasicSalary);
		payslip.setCalculatedHra(calculatedHra);
		payslip.setCalculatedConveyanceAllowance(calculatedConveyanceAllowance);
		payslip.setCalculatedRetentionAllowance(calculatedRetentionAllowance);
		payslip.setCalculatedProvidentFund(calculatedProvidentFund);
		payslip.setCalculatedTds(calculatedTds);

		// Calculate Gross Salary
		BigDecimal grossSalary = calculatedBasicSalary.add(calculatedHra).add(calculatedConveyanceAllowance)
				.add(calculatedRetentionAllowance).add(lta).add(mobileAllowance);

		// Calculate Total Deductions
		BigDecimal totalDeductions = calculatedProvidentFund.add(professionTax).add(calculatedTds);

		// Calculate Net Salary
		BigDecimal netSalary = grossSalary.subtract(totalDeductions);

		// Set calculated values to the Payslip
		payslip.setGrossSalary(grossSalary);
		payslip.setTotalDeductions(totalDeductions);
		payslip.setNetSalary(netSalary);

		payslipDao.save(payslip);

		LOG.info("Payslip generated for employee: {}", employee.getEmployee().getId());
	}

	public double calculateTotalAbsentDays(List<Attendance> attendances) {
		// Define the absent statuses and their corresponding absent day values
		double totalAbsentDays = attendances.stream()
				.filter(attendance -> AttendanceStatus.LOSS_OF_PAY.value().equals(attendance.getStatus())
						|| AttendanceStatus.HALF_LOSS_OF_PAY.value().equals(attendance.getStatus()))
				.mapToDouble(attendance -> {
					if (AttendanceStatus.LOSS_OF_PAY.value().equals(attendance.getStatus())) {
						return 1.0; // 1 day absent for Loss of Pay
					} else if (AttendanceStatus.HALF_LOSS_OF_PAY.value().equals(attendance.getStatus())) {
						return 0.5; // 0.5 day absent for Half Loss of Pay
					}
					return 0.0;
				}).sum(); // Sum up all the absent days

		return totalAbsentDays;
	}

	public double calculateTotalPresentDays(List<Attendance> attendances) {
		// Define the present statuses and their corresponding present day values
		double totalPresentDays = attendances.stream()
				.filter(attendance -> AttendanceStatus.PRESENT.value().equals(attendance.getStatus())
						|| AttendanceStatus.PAID_LEAVE.value().equals(attendance.getStatus())
						|| AttendanceStatus.HALF_PAID_LEAVE.value().equals(attendance.getStatus()))
				.mapToDouble(attendance -> {
					if (AttendanceStatus.PRESENT.value().equals(attendance.getStatus())
							|| AttendanceStatus.PAID_LEAVE.value().equals(attendance.getStatus())
							|| AttendanceStatus.HALF_PAID_LEAVE.value().equals(attendance.getStatus())) {
						return 1.0; // 1 day present for Present, Paid Leave, or Half Paid Leave
					}
					return 0.0;
				}).sum(); // Sum up all the present days

		return totalPresentDays;
	}

	public String getYearMonth(String date) {
		if (date != null && date.length() >= 7) {
			return date.substring(0, 7) + "-";
		} else {
			throw new IllegalArgumentException("Invalid date format");
		}
	}

	// Gracefully shuts down the ExecutorService when the application context is
	// closed
	@PreDestroy
	public void shutdownExecutorService() {
		LOG.info("Shutting down ExecutorService...");
		executorService.shutdown();
		LOG.info("ExecutorService shut down successfully.");
	}
}
