package com.hrms.dto;

import java.math.BigDecimal;

import org.springframework.beans.BeanUtils;

import com.hrms.entity.Employee;

import lombok.Data;

@Data
public class AddEmployeeRequest {

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

	private String employmentType; // Full-time, Part-time, Contract, Intern
	private String dateOfJoining; // Format: YYYY-MM-DD
	private String dateOfExit; // Format: YYYY-MM-DD (nullable for active employees)

	private String workLocation; // Office location or remote
	private double availableLeave;

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

	// Emergency Contact
	private String emergencyContactName;
	private String emergencyContactPhone;
	private String emergencyContactRelation;

	private int hrId; // from user

	private int reportingManagerId; // from user

	private int designationId; // Employee's designation

	private int departmentId; // Employee's department

	private int employeeUserId; // From User table

	public static Employee toEmployeeEntity(AddEmployeeRequest dto) {
		Employee employee = new Employee();
		BeanUtils.copyProperties(dto, employee, "hrId", "reportingManagerId", "designationId", "departmentId",
				"employeeUserId");
		return employee;
	}

	public boolean validateSalaryDetails() {
		// Validate required salary fields
		if (ctc == null || ctc.compareTo(BigDecimal.ZERO) <= 0)
			return false;
		if (basicSalary == null || basicSalary.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (hra == null || hra.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (lta == null || lta.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (conveyanceAllowance == null || conveyanceAllowance.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (retentionAllowance == null || retentionAllowance.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (mobileAllowance == null || mobileAllowance.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (providentFund == null || providentFund.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (professionTax == null || professionTax.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (tds == null || tds.compareTo(BigDecimal.ZERO) < 0)
			return false;

		// Validate extra day pay details
		if (extraDayPayBase == null || extraDayPayBase.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (extraDayPayHra == null || extraDayPayHra.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (extraDayPayConveyanceAllowance == null || extraDayPayConveyanceAllowance.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (extraDayPayRetentionAllowance == null || extraDayPayRetentionAllowance.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (extraDayPayPf == null || extraDayPayPf.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (extraDayPayTds == null || extraDayPayTds.compareTo(BigDecimal.ZERO) < 0)
			return false;

		// Validate absent day pay details
		if (absentDayPayBase == null || absentDayPayBase.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (absentDayPayHra == null || absentDayPayHra.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (absentDayPayConveyanceAllowance == null || absentDayPayConveyanceAllowance.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (absentDayPayRetentionAllowance == null || absentDayPayRetentionAllowance.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (absentDayPayPf == null || absentDayPayPf.compareTo(BigDecimal.ZERO) < 0)
			return false;
		if (absentDayPayTds == null || absentDayPayTds.compareTo(BigDecimal.ZERO) < 0)
			return false;

		// If all validations pass, return true
		return true;
	}

}
