package com.hrms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hrms.dto.CommonApiResponse;
import com.hrms.dto.JobPostingRequestDto;
import com.hrms.dto.JobResponseDto;
import com.hrms.service.JobService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/job")
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {

	@Autowired
	private JobService jobService;

	// Add a new job
	@PostMapping("/add")
	public ResponseEntity<CommonApiResponse> addJob(@Valid @RequestBody JobPostingRequestDto requestDto) {
		return jobService.addJob(requestDto);
	}

	// Get all jobs
	@GetMapping("/list")
	public ResponseEntity<JobResponseDto> getAllJobs() {
		return jobService.getAllJobs();
	}

	// Delete a job by ID
	@DeleteMapping("/delete/{jobId}")
	public ResponseEntity<CommonApiResponse> deleteJob(@PathVariable int jobId) {
		return jobService.deleteJob(jobId);
	}

	// Fetch all jobs by company ID
	@GetMapping("/company/{companyId}")
	public ResponseEntity<JobResponseDto> getJobsByCompany(@PathVariable int companyId) {
		return jobService.getJobsByCompany(companyId);
	}
	
	// Update job status
	@PutMapping("/update-status")
	public ResponseEntity<CommonApiResponse> updateJobStatus(
	        @RequestParam int jobId,
	        @RequestParam String status) {
	    return jobService.updateJobStatus(jobId, status);
	}

	
}
