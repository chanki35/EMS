package com.hrms.scheduler;

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
import com.hrms.dao.EmployeeDao;
import com.hrms.entity.Attendance;
import com.hrms.entity.Company;
import com.hrms.entity.Employee;
import com.hrms.entity.User;
import com.hrms.utility.Constants;
import com.hrms.utility.Constants.AttendanceStatus;
import com.hrms.utility.Constants.CompanyStatus;
import com.hrms.utility.Constants.WorkingStatus;

import jakarta.annotation.PreDestroy;

@Component
public class AttendanceAbsentScheduler {

	private static final Logger LOG = LoggerFactory.getLogger(AttendanceAbsentScheduler.class);

	@Autowired
	private AttendanceDao attendanceDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private EmployeeDao employeeDao;

	private final ExecutorService executorService = Executors.newFixedThreadPool(10);

	// Scheduled to run every day at 1:00 AM
	@Scheduled(cron = "0 0 1 * * ?")
	public void markAbsentForMissingAttendance() {
		LOG.info("Attendance Absent Scheduler Starting on thread: {}", Thread.currentThread().getName());

		LocalDate yesterday = LocalDate.now().minusDays(1);

		List<Company> companies = companyDao.findByStatus(CompanyStatus.ACTIVE.value());

		if (CollectionUtils.isEmpty(companies)) {
			LOG.info("No Active Companies found! Scheduler stopped.");
			return;
		}

		companies.forEach(company -> executorService.submit(() -> processCompanyAttendance(company, yesterday)));

		LOG.info("Attendance Absent Scheduler Completed.");
	}

	private void processCompanyAttendance(Company company, LocalDate date) {
		LOG.info("Processing attendance for company: {} on thread: {}", company.getName(),
				Thread.currentThread().getName());

		List<Attendance> attendances = attendanceDao.findByCompanyAndDateAndWorkingStatus(company, date.toString(),
				WorkingStatus.WORKING.value());

		if (CollectionUtils.isEmpty(attendances)) {
			LOG.info("No working day attendance records found for company: {}", company.getName());
			return;
		}

		attendances.forEach(attendance -> executorService.submit(() -> checkAndMarkAbsent(attendance)));

		LOG.info("Completed attendance processing for company: {}", company.getName());
	}

	private void checkAndMarkAbsent(Attendance attendance) {
		LOG.info("Checking attendance for employee: {} {}", attendance.getEmployeeUser().getFirstName(),
				attendance.getEmployeeUser().getLastName());

		if (isAttendanceMissing(attendance)) {
			markAsAbsent(attendance);
		}
	}

	private boolean isAttendanceMissing(Attendance attendance) {
		
		// status NA --> if clock out is not done  but clock in can be done
		if(attendance.getStatus().equals("NA")) {
			return true;
		} else {
			return false;
		}
		
		
	}

	private void markAsAbsent(Attendance attendance) {
		LOG.info("Marking as absent for employee: {} {} on date: {}", attendance.getEmployeeUser().getFirstName(),
				attendance.getEmployeeUser().getLastName(), attendance.getDate());

		User user = attendance.getEmployeeUser();
		Employee employee = user.getEmployee();

		double totalAvailableLeaves = employee.getAvailableLeave();

		if (Constants.FULL_DAY <= totalAvailableLeaves) {
			attendance.setStatus(AttendanceStatus.PAID_LEAVE.value());
			employee.setAvailableLeave(totalAvailableLeaves - Constants.FULL_DAY);
			employeeDao.save(employee);
		} else {
			attendance.setStatus(AttendanceStatus.LOSS_OF_PAY.value());
		}

		attendance.setLastUpdatedDate(String.valueOf(System.currentTimeMillis()));
		attendanceDao.save(attendance);

		LOG.info("Absent marked for employee: {} {} on date: {}", attendance.getEmployeeUser().getFirstName(),
				attendance.getEmployeeUser().getLastName(), attendance.getDate());
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
