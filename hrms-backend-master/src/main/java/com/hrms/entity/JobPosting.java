package com.hrms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class JobPosting {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@ManyToOne
	@JoinColumn(name = "designation_id", nullable = false)
	private Designation designation; // Related designation (optional if specific roles are listed)

	private String description; // Detailed description of the job

	private String location;

	private String requiredSkills; // Comma-separated list of required skills (e.g., Java, Spring, SQL)

	private int experience; // Required experience in years

	private String status; // Open or Close

	// Metadata
	@ManyToOne
	@JoinColumn(name = "user_created_by_hr", nullable = false)
	private User createdBy; // Employee who created or referred the job

	private String createdDate; // Timestamp of job posting creation

	private String updatedDate; // Timestamp of the last update

	@ManyToOne
	@JoinColumn(name = "company_id")
	private Company company;

}
