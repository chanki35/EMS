package com.hrms.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hrms.dto.AddEmployeeDocumentRequest;
import com.hrms.dto.AddEmployeeRequest;
import com.hrms.dto.CommonApiResponse;
import com.hrms.service.EmployeeService;
import com.hrms.utility.StorageService;
import com.lowagie.text.DocumentException;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("api/employee")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {

	@Autowired
	private EmployeeService employeeService;
	
	@Autowired
	private StorageService storageService;

	@PostMapping("/add")
	@Operation(summary = "Api to add employee")
	public ResponseEntity<CommonApiResponse> addEmployee(@RequestBody AddEmployeeRequest request) {
		return employeeService.addEmployee(request);
	}

	@PutMapping("/add/document")
	@Operation(summary = "Api to add the employee document")
	public ResponseEntity<CommonApiResponse> updateEmployeeDocument(AddEmployeeDocumentRequest request) {
		return employeeService.updateEmployeeDocument(request);
	}

	@PutMapping("/update/bank-account")
	@Operation(summary = "API to update the employee bank account and provident fund details")
	public ResponseEntity<CommonApiResponse> updateEmployeeBankAccountDetails(@RequestBody AddEmployeeRequest request) {
		return employeeService.updateEmployeeBankAccountDetails(request);
	}

	@PutMapping("/update/personal/detail")
	@Operation(summary = "API to update the personal, address, and emergency contact details of the employee")
	public ResponseEntity<CommonApiResponse> updateEmployeePersonalDetail(@RequestBody AddEmployeeRequest request) {
		return employeeService.updateEmployeePersonalDetail(request);
	}

	@PutMapping("/update/salary/detail")
	@Operation(summary = "Api to update the employee salary detail")
	public ResponseEntity<CommonApiResponse> updateEmployeeSalaryDetail(@RequestBody AddEmployeeRequest request) {
		return employeeService.updateEmployeeSalaryDetail(request);
	}

	@PutMapping("/update/designation")
	@Operation(summary = "API to update an employee's designation")
	public ResponseEntity<CommonApiResponse> updateEmployeeDesignation(@RequestParam("employeeId") int employeeId,
			@RequestParam("designationId") int designationId) {
		return employeeService.updateEmployeeDesignation(employeeId, designationId);
	}

	@PutMapping("/update/department-designation-manager")
	@Operation(summary = "API to update an employee's department and designation")
	public ResponseEntity<CommonApiResponse> updateEmployeeDepartmentAndDesignation(
			@RequestParam("employeeId") int employeeId, @RequestParam("departmentId") int departmentId,
			@RequestParam("designationId") int designationId,
			@RequestParam("reportingManagerId") int reportingManagerId) {
		return employeeService.updateEmployeeDepartmentAndDesignation(employeeId, departmentId, designationId,
				reportingManagerId);
	}

	@PutMapping("/update/employment-status")
	@Operation(summary = "API to update employment status and date of exit for an employee")
	public ResponseEntity<CommonApiResponse> updateEmploymentStatus(@RequestParam("userId") int userId,
			@RequestParam("status") String status, @RequestParam("dateOfExit") String dateOfExit) {
		return employeeService.updateEmploymentStatus(userId, status, dateOfExit);
	}
	
	@GetMapping(value = "/{employeeProfilePic}", produces = "image/*")
	@Operation(summary = "Api to fetch employee profile photo")
	public void fetchEmployeeProfilePic(@PathVariable("employeeProfilePic") String employeeProfilePic, HttpServletResponse resp) {
		this.employeeService.fetchEmployeeProfilePic(employeeProfilePic, resp);
	}
	
	@GetMapping("/document/{documentFileName}/view")
	@Operation(summary = "API for viewing the document in PDF viewer")
	public ResponseEntity<Resource> viewDocument(@PathVariable("documentFileName") String documentFileName) {
		Resource resource = storageService.load(documentFileName);
		if (resource == null) {
			// Handle file not found
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF) // Set content type to PDF
				.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + documentFileName + "\"") // Inline
																											// display
				.body(resource);
	}
	
	@GetMapping("/document/{documentFileName}/download")
	@Operation(summary = "Api for downloading the Employee document")
	public ResponseEntity<Resource> downloadDocumemt(@PathVariable("documentFileName") String documentFileName,
			HttpServletResponse response) throws DocumentException, IOException {
		return this.employeeService.downloadDocumemt(documentFileName, response);
	}

}
