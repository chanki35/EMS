package com.hrms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hrms.dto.AddCompanyRequest;
import com.hrms.dto.CommonApiResponse;
import com.hrms.dto.CompanyResponse;
import com.hrms.service.CompanyService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("api/company")
@CrossOrigin(origins = "http://localhost:3000")
public class CompanyController {

	@Autowired
	private CompanyService companyService;

	@PostMapping("register")
	@Operation(summary = "Api to register the company")
	public ResponseEntity<CompanyResponse> registerCompany(@RequestBody AddCompanyRequest request) {
		return this.companyService.registerCompany(request);
	}

	@PutMapping("update/status")
	@Operation(summary = "Api to update the company status")
	public ResponseEntity<CommonApiResponse> updateCompanyStatus(@RequestParam("companyId") int companyId,
			@RequestParam("status") String status) {
		return this.companyService.updateCompanyStatus(companyId, status);
	}

	@GetMapping("/fetch/status-wise")
	@Operation(summary = "Api to all companies by status")
	public ResponseEntity<CompanyResponse> fetchCompanyByStatus(@RequestParam("status") String status) {
		return companyService.fetchCompanyByStatus(status);
	}

}
