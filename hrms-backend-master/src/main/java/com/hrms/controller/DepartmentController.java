package com.hrms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hrms.dto.AddDepartmentRequest;
import com.hrms.dto.CommonApiResponse;
import com.hrms.dto.DepartmentResponseDto;
import com.hrms.service.DepartmentService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("api/department")
@CrossOrigin(origins = "http://localhost:3000")
public class DepartmentController {

	@Autowired
	private DepartmentService departmentService;
	
	@PostMapping("/add")
	@Operation(summary = "Api to add department")
	public ResponseEntity<CommonApiResponse> addDepartment(@RequestBody AddDepartmentRequest request) {
		return departmentService.addDepartment(request);
	}

	@PutMapping("/update")
	@Operation(summary = "Api to update department")
	public ResponseEntity<CommonApiResponse> updateDepartment(@RequestBody AddDepartmentRequest request) {
		return departmentService.updateDepartment(request);
	}

	@GetMapping("/fetch/company-wise")
	@Operation(summary = "Api to fetch all departments by company id")
	public ResponseEntity<DepartmentResponseDto> fetchAllDepartmentByCompany(
			@RequestParam("companyId") int companyId) {
		return departmentService.fetchAllDepartmentByCompany(companyId);
	}

	@DeleteMapping("/delete")
	@Operation(summary = "Api to delete department")
	public ResponseEntity<CommonApiResponse> deleteDepartment(@RequestParam("departmentId") int departmentId) {
		return departmentService.deleteDepartment(departmentId);
	}
	
}
