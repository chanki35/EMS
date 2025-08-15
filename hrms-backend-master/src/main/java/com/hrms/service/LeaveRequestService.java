package com.hrms.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.hrms.dao.AttendanceDao;
import com.hrms.dao.DesignationDao;
import com.hrms.dao.EmployeeDao;
import com.hrms.dao.LeaveRequestDao;
import com.hrms.dao.UserDao;
import com.hrms.dto.AddLeaveRequestDto;
import com.hrms.dto.CommonApiResponse;
import com.hrms.dto.LeaveRequestResonseDto;
import com.hrms.entity.Attendance;
import com.hrms.entity.Designation;
import com.hrms.entity.Employee;
import com.hrms.entity.LeaveRequest;
import com.hrms.entity.User;
import com.hrms.utility.Constants;
import com.hrms.utility.Constants.AttendanceStatus;
import com.hrms.utility.Constants.LeaveRequestStatus;

@Service
public class LeaveRequestService {

	@Autowired
	private LeaveRequestDao leaveRequestDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private AttendanceDao attendanceDao;

	@Autowired
	private DesignationDao designationDao;
	
	@Autowired
	private EmployeeDao employeeDao;

	public ResponseEntity<CommonApiResponse> addLeaveRequest(AddLeaveRequestDto addLeaveRequestDto) {
		CommonApiResponse response = new CommonApiResponse();

		User employee = userDao.findById(addLeaveRequestDto.getEmployeeUserId()).orElse(null);
		if (employee == null) {
			response.setSuccess(false);
			response.setResponseMessage("Employee not found!");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}

		Designation managerDesignation = designationDao.findByCompanyAndDepartmentAndName(employee.getCompany(),
				employee.getEmployee().getDepartment(), Constants.Designation.PROJECT_MANAGER.value());

		List<User> managers = userDao.findByDesignation(managerDesignation);
		if (managers == null || managers.isEmpty()) {
			response.setSuccess(false);
			response.setResponseMessage("Manager not found!");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}
		
		Attendance attendance = this.attendanceDao.findByEmployeeUserAndDate(employee, addLeaveRequestDto.getDate());
		
		if(attendance.getLeaveRequest() != null) {
			response.setSuccess(false);
			response.setResponseMessage("Leave Request is already applied for this Date!!!");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}

		LeaveRequest leaveRequest = new LeaveRequest();
		leaveRequest.setEmployee(employee);
		leaveRequest.setDate(addLeaveRequestDto.getDate());
		leaveRequest.setReason(addLeaveRequestDto.getReason());
		leaveRequest.setStatus(LeaveRequestStatus.PENDING.value());
		leaveRequest.setCreatedDate(String.valueOf(System.currentTimeMillis()));
		leaveRequest.setManager(managers.get(0));

		LeaveRequest appliedLeaveRequest = leaveRequestDao.save(leaveRequest);

		attendance.setReason(addLeaveRequestDto.getReason());
		attendance.setLeaveRequest(appliedLeaveRequest);
		
		this.attendanceDao.save(attendance);

		response.setSuccess(true);
		response.setResponseMessage("Leave request submitted successfully!!!");
		return ResponseEntity.ok(response);
	}

	public ResponseEntity<CommonApiResponse> updateLeaveStatus(int id, String status, String managerComments) {
		CommonApiResponse response = new CommonApiResponse();

		LeaveRequest leaveRequest = leaveRequestDao.findById(id).orElse(null);
		if (leaveRequest == null) {
			response.setSuccess(false);
			response.setResponseMessage("Leave request not found!");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}

		leaveRequest.setStatus(status);
		leaveRequest.setManagerComments(managerComments);
		leaveRequest.setLastUpdatedDate(String.valueOf(System.currentTimeMillis()));

		leaveRequestDao.save(leaveRequest);

		// If approved, update attendance
		if (status.equals(LeaveRequestStatus.APPROVED.value())) {
			updateAttendanceForLeave(leaveRequest);
		}

		response.setSuccess(true);
		response.setResponseMessage("Leave request " + status.toLowerCase() + " successfully!");
		return ResponseEntity.ok(response);
	}

	public ResponseEntity<LeaveRequestResonseDto> getLeaveRequestsForEmployee(int employeeId) {
		LeaveRequestResonseDto response = new LeaveRequestResonseDto();

		User employee = userDao.findById(employeeId).orElse(null);
		if (employee == null) {
			response.setSuccess(false);
			response.setResponseMessage("Employee not found!");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}

		List<LeaveRequest> leaveRequests = leaveRequestDao.findByEmployee(employee);

		if (CollectionUtils.isEmpty(leaveRequests)) {
			response.setSuccess(false);
			response.setResponseMessage("Leave Request not found!!");
			return ResponseEntity.status(HttpStatus.OK).body(response);
		}

		response.setRequests(leaveRequests);
		response.setSuccess(true);
		response.setResponseMessage("Leave requests fetched successfully!");
		return ResponseEntity.ok(response);
	}

	public ResponseEntity<LeaveRequestResonseDto> getLeaveRequestsForManager(int managerId) {
		LeaveRequestResonseDto response = new LeaveRequestResonseDto();

		User manager = userDao.findById(managerId).orElse(null);
		if (manager == null) {
			response.setSuccess(false);
			response.setResponseMessage("Manager not found!");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}

		List<LeaveRequest> leaveRequests = leaveRequestDao.findByManager(manager);

		if (CollectionUtils.isEmpty(leaveRequests)) {
			response.setSuccess(false);
			response.setResponseMessage("Leave Request not found!!");
			return ResponseEntity.status(HttpStatus.OK).body(response);
		}

		response.setRequests(leaveRequests);
		response.setSuccess(true);
		response.setResponseMessage("Leave requests fetched successfully!");
		return ResponseEntity.ok(response);
	}

	private void updateAttendanceForLeave(LeaveRequest leaveRequest) {
		User employee = leaveRequest.getEmployee();
		String leaveDate = leaveRequest.getDate();

		Attendance attendance = attendanceDao.findByEmployeeUserAndDate(employee, leaveDate);

		Employee userEmployee = employee.getEmployee();
		double availableLeave = userEmployee.getAvailableLeave();

		if (availableLeave >= Constants.FULL_DAY) {
			attendance.setStatus(AttendanceStatus.PAID_LEAVE.value());
			attendance.setReason(leaveRequest.getReason());
			userEmployee.setAvailableLeave(availableLeave - Constants.FULL_DAY);
			employeeDao.save(userEmployee);
		} else {
			attendance.setStatus(AttendanceStatus.LOSS_OF_PAY.value());
		}

		attendanceDao.save(attendance);
	}

}
