package com.hrms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Company {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String name; // Company name
	private String registrationNumber; // Unique identifier for the company
	private String address; // Registered address
	private String city;
	private String state;
	private String postalCode;
	private String country;

	private String contactPersonName; // Primary contact person for the company
	private String contactEmail; // Email of the contact person
	private String contactPhone; // Phone number of the contact person

	private String industryType; // E.g., IT, Healthcare, Finance
	private String websiteUrl; // Company website
	private String createdDate; // Timestamp of company creation
	
	private int mandatoryWorkingHour;

	private String status;

}
