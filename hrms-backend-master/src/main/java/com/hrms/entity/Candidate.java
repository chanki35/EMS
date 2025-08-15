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
public class Candidate {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	// Personal Information
	private String firstName;
	private String lastName;
	private String email;
	private String password;
	private String phone;
	private String gender; // Male, Female, Other
	private String dateOfBirth; // Format: YYYY-MM-DD

	// Address Information
	private String address;
	private String city;
	private String state;
	private String postalCode;

	// Professional Information
	private String highestQualification;
	private int totalExperience; // In years
	private String skills; // Comma-separated list of skills (e.g., Java, Spring, SQL)

	private String resumeFileName; // Path or name of the resume file uploaded

	// Referral Information
	private String source; // E.g., Employee Referral, Job Portal, Promotion

	@ManyToOne
	@JoinColumn(name = "referred_user")
	private User referredUser; // If referred, name or ID of the referring employee

	@ManyToOne
	@JoinColumn(name = "user_hr_id")
	private User hr;

	// Metadata
	private String createdDate; // Timestamp when the candidate was added
	private String lastUpdatedDate; // Timestamp for the last update
	private String status; // Active, Inactive

	@ManyToOne
	@JoinColumn(name = "company_id")
	private Company company;

}
