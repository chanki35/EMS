package com.hrms.entity;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class Payslip {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	// Employee Details Snapshot
	@ManyToOne
	@JoinColumn(name = "employee_id", nullable = false)
	private Employee employee; // Reference to the employee

	private String employeeCode;
	private String fullName;
	private String designationName;
	private String departmentName;

	// Salary Components (Snapshot from Employee table)
	private BigDecimal ctc; // Annual CTC at the time
	private BigDecimal basicSalary;
	private BigDecimal hra; // House Rent Allowance
	private BigDecimal lta; // Leave Travel Allowance
	private BigDecimal conveyanceAllowance;
	private BigDecimal retentionAllowance;
	private BigDecimal mobileAllowance;
	private BigDecimal providentFund;
	private BigDecimal professionTax;
	private BigDecimal tds; // Tax Deducted at Source

	// Calculated Salary Components (Calculated during Payslip Generation)
	private BigDecimal calculatedBasicSalary;
	private BigDecimal calculatedHra;
	private BigDecimal calculatedConveyanceAllowance;
	private BigDecimal calculatedRetentionAllowance;
	private BigDecimal calculatedProvidentFund;
	private BigDecimal calculatedTds;

	// Adjustments for Extra Days (Snapshot from Employee table)
	private BigDecimal extraDayPayBase;
	private BigDecimal extraDayPayHra;
	private BigDecimal extraDayPayConveyanceAllowance;
	private BigDecimal extraDayPayRetentionAllowance;
	private BigDecimal extraDayPayPf;
	private BigDecimal extraDayPayTds;

	// Deductions for Absent Days (Snapshot from Employee table)
	private BigDecimal absentDayPayBase;
	private BigDecimal absentDayPayHra;
	private BigDecimal absentDayPayConveyanceAllowance;
	private BigDecimal absentDayPayRetentionAllowance;
	private BigDecimal absentDayPayPf;
	private BigDecimal absentDayPayTds;

	// Month and Year
	private String month; // e.g., "January", "February"
	private int year;

	// Work Days
	private double totalDaysInMonth;
	private double totalWorkingDays;
	private double daysPresent;
	private double daysAbsent;
	private double extraWorkingDays;

	// Final Salary Calculation
	private BigDecimal grossSalary; // Total Salary before deductions
	private BigDecimal totalDeductions; // Total deductions for the month
	private BigDecimal netSalary; // Final Salary paid after deductions

	// Bank Details (Snapshot at the time)
	private String bankName;
	private String bankAccountNumber;
	private String ifscCode;

}
