package com.hrms.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
@Entity
public class Employee {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	// Personal Information
	private String firstName;
	private String lastName;
	private String emailId;
	private String phoneNo;
	private String gender;
	private String dateOfBirth; // Format: YYYY-MM-DD
	private String maritalStatus; // Single, Married, etc.
	private String bloodGroup;

	// Address Information
	private String permanentAddress;
	private String currentAddress;
	private String city;
	private String state;
	private String postalCode;

	// Employment Details
	private String employeeCode; // Unique employee identifier

	@ManyToOne
	@JoinColumn(name = "designation_id")
	private Designation designation; // Employee's designation

	@ManyToOne
	@JoinColumn(name = "department_id")
	private Department department; // Employee's department

	private String employmentType; // Full-time, Part-time, Contract, Intern
	private String dateOfJoining; // Format: YYYY-MM-DD
	private String dateOfExit; // Format: YYYY-MM-DD (nullable for active employees)

	@ManyToOne
	@JoinColumn(name = "user_manager_id")
	private User reportingManager;   // In case of Project Manager Designation keep it null

	private String workLocation; // Office location or remote

	// Salary and Payroll Information
	private BigDecimal ctc; // Annual CTC
	private BigDecimal basicSalary;
	private BigDecimal hra; // House Rent Allowance
	private BigDecimal lta; // Leave Travel Allowance
	private BigDecimal conveyanceAllowance;
	private BigDecimal retentionAllowance;
	private BigDecimal mobileAllowance;
	private BigDecimal providentFund;
	private BigDecimal professionTax;
	private BigDecimal tds; // Tax Deducted at Source

	// Adjustments for Extra Days
	private BigDecimal extraDayPayBase;
	private BigDecimal extraDayPayHra;
	private BigDecimal extraDayPayConveyanceAllowance;
	private BigDecimal extraDayPayRetentionAllowance;
	private BigDecimal extraDayPayPf;
	private BigDecimal extraDayPayTds;

	// Deductions for Absent Days
	private BigDecimal absentDayPayBase;
	private BigDecimal absentDayPayHra;
	private BigDecimal absentDayPayConveyanceAllowance;
	private BigDecimal absentDayPayRetentionAllowance;
	private BigDecimal absentDayPayPf;
	private BigDecimal absentDayPayTds;

	// provident fund account detail
	private String pfNo;
	private String uan;

	// Bank Details
	private String bankName;
	private String bankAccountNumber;
	private String ifscCode;
	private String panNumber; // Permanent Account Number
	private String aadhaarNumber; // Government-issued ID in India (or equivalent)

	// Documents
	private String resumeFileName;
	private String governmentProofFileImage;
	private String profileImage;

	// Emergency Contact
	private String emergencyContactName;
	private String emergencyContactPhone;
	private String emergencyContactRelation;

	// Status and Metadata
	private String employmentStatus; // Active, Resigned, Terminated

	@ManyToOne
	@JoinColumn(name = "user_hr_id")
	private User hr;

	private String createdDate; // Timestamp

	private double availableLeave;

	@JsonIgnore
	@OneToOne
	@JoinColumn(name = "user_id")
	private User employeeUser;

}
