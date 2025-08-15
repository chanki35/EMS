package com.hrms.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.hrms.dao.CompanyDao;
import com.hrms.dao.DesignationDao;
import com.hrms.dao.JobPostingDao;
import com.hrms.dao.UserDao;
import com.hrms.dto.CommonApiResponse;
import com.hrms.dto.JobPostingRequestDto;
import com.hrms.dto.JobResponseDto;
import com.hrms.entity.Company;
import com.hrms.entity.Designation;
import com.hrms.entity.JobPosting;
import com.hrms.entity.User;
import com.hrms.utility.Constants.JobPostingStatus;

@Service
public class JobService {

	@Autowired
	private JobPostingDao jobPostingDao;

	@Autowired
	private DesignationDao designationDao; // Assuming a Designation repository exists

	@Autowired
	private CompanyDao companyDao; // Assuming a Company repository exists

	@Autowired
	private UserDao userDao; // Assuming a User repository exists

	public ResponseEntity<CommonApiResponse> addJob(JobPostingRequestDto requestDto) {
		CommonApiResponse response = new CommonApiResponse();

		// Fetch Designation
		Designation designation = designationDao.findById(requestDto.getDesignationId()).orElse(null);
		if (designation == null) {
			response.setSuccess(false);
			response.setResponseMessage("Invalid Designation ID");
			return ResponseEntity.badRequest().body(response);
		}

		// Fetch Company
		Company company = companyDao.findById(requestDto.getCompanyId()).orElse(null);
		if (company == null) {
			response.setSuccess(false);
			response.setResponseMessage("Invalid Company ID");
			return ResponseEntity.badRequest().body(response);
		}

		// Fetch HR User
		User hrUser = userDao.findById(requestDto.getHrId()).orElse(null);
		if (hrUser == null) {
			response.setSuccess(false);
			response.setResponseMessage("Invalid HR User ID");
			return ResponseEntity.badRequest().body(response);
		}

		// Create and Save JobPosting
		JobPosting jobPosting = new JobPosting();
		jobPosting.setDesignation(designation);
		jobPosting.setDescription(requestDto.getDescription());
		jobPosting.setLocation(requestDto.getLocation());
		jobPosting.setRequiredSkills(requestDto.getRequiredSkills());
		jobPosting.setExperience(requestDto.getExperience());
		jobPosting.setStatus(requestDto.getStatus());
		jobPosting.setCreatedBy(hrUser);
		jobPosting.setCompany(company);
		jobPosting.setCreatedDate(String.valueOf(System.currentTimeMillis()));
		jobPosting.setUpdatedDate(String.valueOf(System.currentTimeMillis()));

		jobPostingDao.save(jobPosting);

		response.setSuccess(true);
		response.setResponseMessage("Job added successfully");
		return ResponseEntity.ok(response);
	}

	public ResponseEntity<JobResponseDto> getAllJobs() {
		JobResponseDto response = new JobResponseDto();
		response.setJobPostings(jobPostingDao.findAll());
		response.setSuccess(true);
		response.setResponseMessage("Job postings retrieved successfully");
		return ResponseEntity.ok(response);
	}

	public ResponseEntity<CommonApiResponse> updateJob(int jobId, JobPostingRequestDto requestDto) {
		CommonApiResponse response = new CommonApiResponse();

		JobPosting existingJob = jobPostingDao.findById(jobId).orElse(null);
		if (existingJob == null) {
			response.setSuccess(false);
			response.setResponseMessage("Job not found");
			return ResponseEntity.status(404).body(response);
		}

		// Update Job Details
		existingJob.setDescription(requestDto.getDescription());
		existingJob.setLocation(requestDto.getLocation());
		existingJob.setRequiredSkills(requestDto.getRequiredSkills());
		existingJob.setExperience(requestDto.getExperience());
		existingJob.setStatus(requestDto.getStatus());
		existingJob.setUpdatedDate(String.valueOf(System.currentTimeMillis()));

		jobPostingDao.save(existingJob);

		response.setSuccess(true);
		response.setResponseMessage("Job updated successfully");
		return ResponseEntity.ok(response);
	}

	public ResponseEntity<CommonApiResponse> deleteJob(int jobId) {
		CommonApiResponse response = new CommonApiResponse();

		JobPosting jobPosting = jobPostingDao.findById(jobId).orElse(null);
		if (jobPosting == null) {
			response.setSuccess(false);
			response.setResponseMessage("Job not found");
			return ResponseEntity.status(404).body(response);
		}

		jobPostingDao.delete(jobPosting);

		response.setSuccess(true);
		response.setResponseMessage("Job deleted successfully");
		return ResponseEntity.ok(response);
	}

	public ResponseEntity<JobResponseDto> getJobsByCompany(int companyId) {
		JobResponseDto response = new JobResponseDto();

		Company company = companyDao.findById(companyId).orElse(null);
		if (company == null) {
			response.setSuccess(false);
			response.setResponseMessage("Job not found");
			return ResponseEntity.status(404).body(response);
		}

		// Fetch jobs by company ID
		List<JobPosting> jobPostings = jobPostingDao.findByCompanyAndStatus(company, JobPostingStatus.OPEN.value());
		if (jobPostings.isEmpty()) {
			response.setSuccess(false);
			response.setResponseMessage("No jobs found for the specified company.");
			return ResponseEntity.ok(response);
		}

		response.setJobPostings(jobPostings);
		response.setSuccess(true);
		response.setResponseMessage("Jobs retrieved successfully.");
		return ResponseEntity.ok(response);
	}

	public ResponseEntity<CommonApiResponse> updateJobStatus(int jobId, String status) {
		CommonApiResponse response = new CommonApiResponse();

		// Validate status
		if (!"Open".equalsIgnoreCase(status) && !"Close".equalsIgnoreCase(status)) {
			response.setSuccess(false);
			response.setResponseMessage("Invalid status. Status must be either 'Open' or 'Close'.");
			return ResponseEntity.status(400).body(response);
		}

		// Find the job by ID
		Optional<JobPosting> jobPostingOpt = jobPostingDao.findById(jobId);
		if (!jobPostingOpt.isPresent()) {
			response.setSuccess(false);
			response.setResponseMessage("Job not found with the specified ID.");
			return ResponseEntity.status(404).body(response);
		}

		// Update status
		JobPosting jobPosting = jobPostingOpt.get();
		jobPosting.setStatus(status);
		jobPosting.setUpdatedDate(String.valueOf(System.currentTimeMillis())); // Update the timestamp
		jobPostingDao.save(jobPosting);

		response.setSuccess(true);
		response.setResponseMessage("Job status updated successfully.");
		return ResponseEntity.ok(response);
	}

}
