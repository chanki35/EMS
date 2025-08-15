package com.hrms.dto;

import org.springframework.beans.BeanUtils;

import com.hrms.entity.Company;

import lombok.Data;

@Data
public class AddCompanyRequest {

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
	
	private int userId; // company user id
	
	private int mandatoryWorkingHour;

	public static Company toCompanyEntity(AddCompanyRequest dto) {
		Company company = new Company();
		BeanUtils.copyProperties(dto, company, "userId");
		return company;
	}

}
