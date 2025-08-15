package com.hrms.dto;

import lombok.Data;

@Data
public class JobPostingRequestDto {

	private int designationId;

	private String description; // Detailed description of the job

	private String location;

	private String requiredSkills; // Comma-separated list of required skills (e.g., Java, Spring, SQL)

	private int experience; // Required experience in years

	private String status; // Open or Close

	private int hrId; // created user id

	private int companyId;

}
