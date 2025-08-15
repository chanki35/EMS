package com.hrms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hrms.dto.AttendanceResponseDto;
import com.hrms.dto.CommonApiResponse;
import com.hrms.dto.RegularizeRequestDto;
import com.hrms.service.AttendanceService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("api/attendance")
@CrossOrigin(origins = "http://localhost:3000")
public class AttendanceController {

	@Autowired
	private AttendanceService attendanceService;
	
	@GetMapping("/fetch/employee/current-month")
	@Operation(summary = "Api to fetch employee current month attendances")
	public ResponseEntity<AttendanceResponseDto> fetchEmployeeCurrentMonthAttendances(@RequestParam("userId") int userId) {
		return attendanceService.fetchEmployeeCurrentMonthAttendances(userId);
	}

	@GetMapping("/employee/clock-in")
	@Operation(summary = "Api to clock in")
	public ResponseEntity<CommonApiResponse> clockIn(@RequestParam("userId") int userId) {
		return attendanceService.clockIn(userId);
	}

	@GetMapping("/employee/clock-out")
	@Operation(summary = "Api to clock in")
	public ResponseEntity<CommonApiResponse> clockOut(@RequestParam("userId") int userId) {
		return attendanceService.clockOut(userId);
	}

	@PostMapping("/employee/regularize")
	@Operation(summary = "Api to regularize employee attendance")
	public ResponseEntity<CommonApiResponse> regularizeEmployeeAttendance(@RequestBody RegularizeRequestDto request) {

		// updatedByUserId --> this can be Project Manager or HR

		return attendanceService.regularizeEmployeeAttendance(request);
	}

}
