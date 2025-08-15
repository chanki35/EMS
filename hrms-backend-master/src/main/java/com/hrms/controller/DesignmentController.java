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

import com.hrms.dto.AddDesignationRequest;
import com.hrms.dto.CommonApiResponse;
import com.hrms.dto.DesignationResponseDto;
import com.hrms.service.DesignationService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("api/designation")
@CrossOrigin(origins = "http://localhost:3000")
public class DesignmentController {

	@Autowired
	private DesignationService designationService;

	@PostMapping("/add")
	@Operation(summary = "Api to add designation")
	public ResponseEntity<CommonApiResponse> addDesignation(@RequestBody AddDesignationRequest request) {
		return designationService.addDesignation(request);
	}

	@PutMapping("/update")
	@Operation(summary = "Api to update designation")
	public ResponseEntity<CommonApiResponse> updateDesignation(@RequestBody AddDesignationRequest request) {
		return designationService.updateDesignation(request);
	}

	@GetMapping("/fetch/company-wise")
	@Operation(summary = "Api to fetch all designations by company id")
	public ResponseEntity<DesignationResponseDto> fetchAllDesignationByCompany(
			@RequestParam("companyId") int companyId) {
		return designationService.fetchAllDesignationByCompany(companyId);
	}

	@GetMapping("/fetch/company-department-wise")
	@Operation(summary = "Api to fetch all designations")
	public ResponseEntity<DesignationResponseDto> fetchAllDesignationByCompanyAndDepartmentId(
			@RequestParam("companyId") int companyId,
			@RequestParam("departmentId") int departmentId) {
		return designationService.fetchAllDesignationByCompanyAndDepartmentId(companyId, departmentId);
	}

	@DeleteMapping("/delete")
	@Operation(summary = "Api to delete designation")
	public ResponseEntity<CommonApiResponse> deleteDesignation(@RequestParam("designationId") int designationId) {
		return designationService.deleteDesignation(designationId);
	}

}
