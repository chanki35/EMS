package com.hrms.scheduler;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.hrms.dao.AttendanceDao;
import com.hrms.dao.CompanyDao;
import com.hrms.dao.HolidayDao;
import com.hrms.dao.UserDao;
import com.hrms.entity.Attendance;
import com.hrms.entity.Company;
import com.hrms.entity.Holiday;
import com.hrms.entity.User;
import com.hrms.utility.Constants.ActiveStatus;
import com.hrms.utility.Constants.CompanyStatus;
import com.hrms.utility.Constants.UserRole;
import com.hrms.utility.Constants.WorkingStatus;

import jakarta.annotation.PreDestroy;

@Component
public class AttendanceScheduler {

	private static final Logger LOG = LoggerFactory.getLogger(AttendanceScheduler.class);

	@Autowired
	private AttendanceDao attendanceDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private HolidayDao holidayDao;

	private final ExecutorService executorService = Executors.newFixedThreadPool(5); // Reduced to avoid congestion

//	@Scheduled(cron = "0 * * * * ?")  // every minute
//	@Scheduled(cron = "0 0 0 * * ?")  // Scheduled to run every day at midnight (12:00 AM)
	public void generateAttendanceEntries() {
		LOG.info("Attendance Scheduler Starting...");

		LocalDate today = LocalDate.now();

		// If it's the first day of the month
		if (today.getDayOfMonth() == 1) {
			LOG.info("Today is the first day of the month: {}", today.getMonth());

			List<Company> companies = this.companyDao.findByStatus(CompanyStatus.ACTIVE.value());

			if (CollectionUtils.isEmpty(companies)) {
				LOG.info("No active companies found. Scheduler stopped.");
				return;
			}

			LOG.info("Running attendance initialization for the new month: {}", today.getMonth());

			for (Company company : companies) {
				executorService.submit(() -> {
					try {
						processCompanyAttendance(company, today);
					} catch (Exception e) {
						LOG.error("Error processing attendance for company: {}", company.getName(), e);
					}
				});
			}

			LOG.info("Attendance process started...");
		}
	}

	private void processCompanyAttendance(Company company, LocalDate today) {
		LOG.info("Processing attendance for company: {}", company.getName());

		List<User> employees = this.userDao.findByRoleAndStatusAndCompanyId(UserRole.ROLE_COMPANY_EMPLOYEE.value(),
				ActiveStatus.ACTIVE.value(), company.getId());

		if (CollectionUtils.isEmpty(employees)) {
			LOG.info("No active employees found for company: {}", company.getName());
			return;
		}

		LOG.info("Total employees to process: {}", employees.size());

		// Fetch holidays for the current month for the company
		List<Holiday> holidays = holidayDao.findByCompanyAndDateContainingIgnoreCase(company,
				getYearMonth(today.toString()));

		for (User employee : employees) {
			try {
				addDefaultAttendanceForEmployee(employee, today, holidays);
			} catch (Exception e) {
				LOG.error("Error processing attendance for employee: {} {}", employee.getFirstName(),
						employee.getLastName(), e);
			}
		}

		LOG.info("Completed attendance processing for company: {}", company.getName());
	}

	private void addDefaultAttendanceForEmployee(User employee, LocalDate today, List<Holiday> holidays) {
		for (int day = 1; day <= today.lengthOfMonth(); day++) {
			LOG.info("Adding attendance entry for day: {} for employee: {} {}", day, employee.getFirstName(),
					employee.getLastName());

			LocalDate attendanceDate = LocalDate.of(today.getYear(), today.getMonth(), day);
			String workingStatus = determineWorkingStatus(attendanceDate, holidays);

			Attendance attendance = new Attendance();
			attendance.setEmployeeUser(employee);
			attendance.setCompany(employee.getCompany()); // Ensure the company is set
			attendance.setDate(attendanceDate.toString());
			attendance.setClockIn("");
			attendance.setClockOut("");
			attendance.setTotalHoursWorked(0);
			attendance.setStatus("NA");
			attendance.setWorkingStatus(workingStatus);
			attendance.setReason("");
			attendance.setAddedBy(employee);
			attendance.setLastUpdatedBy(employee);
			attendance.setLastUpdatedDate(String.valueOf(System.currentTimeMillis()));

			try {
				attendanceDao.save(attendance);
				LOG.info("Saved attendance entry for employee: {} {} on {}", employee.getFirstName(),
						employee.getLastName(), attendanceDate);
			} catch (Exception e) {
				LOG.error("Failed to save attendance for employee: {} {} on {}", employee.getFirstName(),
						employee.getLastName(), attendanceDate, e);
			}
		}
	}

	private String determineWorkingStatus(LocalDate date, List<Holiday> holidays) {
		if (holidays != null) {
			for (Holiday holiday : holidays) {
				if (holiday.getDate().equals(date.toString())) {
					return WorkingStatus.HOLIDAY.value();
				}
			}
		}

		if (date.getDayOfWeek().getValue() == 6 || date.getDayOfWeek().getValue() == 7) {
			return WorkingStatus.HOLIDAY.value();
		}

		return WorkingStatus.WORKING.value();
	}

	public String getYearMonth(String date) {
		if (date != null && date.length() >= 7) {
			return date.substring(0, 7) + "-";
		} else {
			throw new IllegalArgumentException("Invalid date format");
		}
	}

	@PreDestroy
	public void shutdownExecutorService() {
		LOG.info("Shutting down ExecutorService...");
		executorService.shutdown();
		try {
			if (!executorService.awaitTermination(10, TimeUnit.SECONDS)) {
				LOG.warn("ExecutorService did not terminate in the expected time. Forcing shutdown...");
				executorService.shutdownNow();
				if (!executorService.awaitTermination(10, TimeUnit.SECONDS)) {
					LOG.error("ExecutorService did not terminate after forced shutdown.");
				}
			}
		} catch (InterruptedException e) {
			LOG.error("Shutdown process interrupted. Forcing shutdown now.", e);
			executorService.shutdownNow();
			Thread.currentThread().interrupt();
		}
		LOG.info("ExecutorService shut down successfully.");
	}
}
