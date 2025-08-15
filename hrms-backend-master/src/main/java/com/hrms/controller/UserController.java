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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hrms.dto.CommonApiResponse;
import com.hrms.dto.RegisterUserRequestDto;
import com.hrms.dto.UserLoginRequest;
import com.hrms.dto.UserLoginResponse;
import com.hrms.dto.UserResponseDto;
import com.hrms.service.UserService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

	@Autowired
	private UserService userService;

	// RegisterUserRequestDto, we will set only email, password & role from UI
	@PostMapping("/admin/register")
	@Operation(summary = "Api to register Admin")
	public ResponseEntity<CommonApiResponse> registerAdmin(@RequestBody RegisterUserRequestDto request) {
		return userService.registerAdmin(request);
	}

	// for company, hr, employee
	@PostMapping("register")
	@Operation(summary = "Api to register company admin, HR, Employee")
	public ResponseEntity<CommonApiResponse> registerUser(@RequestBody RegisterUserRequestDto request) {
		return this.userService.registerUser(request);
	}

	@PostMapping("login")
	@Operation(summary = "Api to login any User")
	public ResponseEntity<UserLoginResponse> login(@RequestBody UserLoginRequest userLoginRequest) {
		return userService.login(userLoginRequest);
	}

	@GetMapping("/fetch/role-wise")
	@Operation(summary = "Api to get Users By Role")
	public ResponseEntity<UserResponseDto> fetchAllUsersByRole(@RequestParam("role") String role)
			throws JsonProcessingException {
		return userService.getUsersByRole(role);
	}

	@GetMapping("/fetch/user-id")
	@Operation(summary = "Api to get User Detail By User Id")
	public ResponseEntity<UserResponseDto> fetchUserById(@RequestParam("userId") int userId) {
		return userService.getUserById(userId);
	}

	@GetMapping("/fetch/employee/company-wise")
	@Operation(summary = "Api to get Users By Role and Company wise")
	public ResponseEntity<UserResponseDto> fetchAllUsersByRoleAndCompany(@RequestParam("role") String role,
			@RequestParam("companyId") int companyId) throws JsonProcessingException {
		return userService.fetchAllUsersByRoleAndCompany(role, companyId);
	}

	@GetMapping("/fetch/manager-wise/employee/")
	@Operation(summary = "Api to get Employees under the Manager")
	public ResponseEntity<UserResponseDto> fetchManagersEmployees(@RequestParam("userManagerId") int userManagerId) {
		return userService.fetchManagersEmployees(userManagerId);
	}

	@GetMapping("/fetch/employee/all/company-wise")
	@Operation(summary = "Api to get Users By Role and Company wise")
	public ResponseEntity<UserResponseDto> fetchAllUsersByCompany(@RequestParam("companyId") int companyId)
			throws JsonProcessingException {
		return userService.fetchAllUsersByCompany(companyId);
	}

	@GetMapping("/search/employee/company-wise")
	@Operation(summary = "Api to search Employee By Role and Company wise")
	public ResponseEntity<UserResponseDto> searchEmployeeByRoleAndCompanyWise(@RequestParam("role") String role,
			@RequestParam("companyId") int companyId, @RequestParam("employeeFirstName") String employeeFirstName)
			throws JsonProcessingException {
		return userService.searchEmployeeByRoleAndCompanyWise(role, companyId, employeeFirstName);
	}

	@GetMapping("/update/status")
	@Operation(summary = "Api to update the user status")
	public ResponseEntity<CommonApiResponse> updateUserStatus(@RequestParam("userId") int userId,
			@RequestParam("status") String status) throws JsonProcessingException {
		return userService.updateUserStatus(userId, status);
	}

}
