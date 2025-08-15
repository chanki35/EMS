package com.hrms.utility;

public class Constants {
	
	public static double HALF_DAY= 0.5;
	public static double FULL_DAY= 1;

	public static String PROJECT_MANAGER_DESCRIPTION= "Project Manager handles the overall complete project";
	
	public enum UserRole {
		ROLE_COMPANY_ADMIN("Company"),
		ROLE_ADMIN("Admin"),
		ROLE_COMPANY_HR("HR"), 
		ROLE_COMPANY_EMPLOYEE("Employee");

		private String role;

		private UserRole(String role) {
			this.role = role;
		}

		public String value() {
			return this.role;
		}
	}

	public enum ActiveStatus {
		ACTIVE("Active"), 
		DEACTIVATED("Deactivated");

		private String status;

		private ActiveStatus(String status) {
			this.status = status;
		}

		public String value() {
			return this.status;
		}
	}

	public enum MonthEnum {
		JANUARY("January"),
		FEBRUARY("February"),
		MARCH("March"), 
		APRIL("April"), 
		MAY("May"),
		JUNE("June"),
		JULY("July"),
		AUGUST("August"),
		SEPTEMBER("September"),
		OCTOBER("October"),
		NOVEMBER("November"),
		DECEMBER("December");

		private final String monthName;

		MonthEnum(String monthName) {
			this.monthName = monthName;
		}

		public String getMonthName() {
			return monthName;
		}

		public static MonthEnum fromMonthName(String monthName) {
			for (MonthEnum monthEnum : values()) {
				if (monthEnum.getMonthName().equalsIgnoreCase(monthName)) {
					return monthEnum;
				}
			}
			throw new IllegalArgumentException("Invalid month name: " + monthName);
		}
	}
	
	public enum EmployeementType {
		FULL_TIME("Full-time"), 
		PART_TIME("Part-time"),
		INTERN("Intern"),
		CONTRACT("Contract");

		private String type;

		private EmployeementType(String type) {
			this.type = type;
		}

		public String value() {
			return this.type;
		}
	}
	
	public enum MaritalStatus {
		MARRIED("Married"), 
		SINGLE("Single");
		
		private String status;

		private MaritalStatus(String status) {
			this.status = status;
		}

		public String value() {
			return this.status;
		}
	}
	
	public enum EmployeementStatus {
		ACTIVE("Active"), 
		RESIGNED("Resigned"),
		RETIRED("Retired"),
		TERMINATED("Terminated");
		
		private String status;

		private EmployeementStatus(String status) {
			this.status = status;
		}

		public String value() {
			return this.status;
		}
	}
	
	public enum CompanyStatus {
		PENDING("Pending"), 
		ACTIVE("Active"),
		DEACTIVATED("Deactivated"),
		REJECTED("Rejected");

		private String status;

		private CompanyStatus(String status) {
			this.status = status;
		}

		public String value() {
			return this.status;
		}
	}
	
	public enum Designation {
	
		PROJECT_MANAGER("Project Manager");

		private String designation;

		private Designation(String designation) {
			this.designation = designation;
		}

		public String value() {
			return this.designation;
		}
		
	}
	
	public enum ProjectManagerPresentStatus {
		
		YES("Yes"),
		NO("No");

		private String status;

		private ProjectManagerPresentStatus(String status) {
			this.status = status;
		}

		public String value() {
			return this.status;
		}
		
	}
	
	public enum WorkingStatus {
		WORKING("Working"), 
		HOLIDAY("Holiday");

		private String status;

		private WorkingStatus(String status) {
			this.status = status;
		}

		public String value() {
			return this.status;
		}
	}
	
	public enum AttendanceStatus {
		 // no deduction in pay slip
		PRESENT("Present"), 
		PAID_LEAVE("Paid Leave"),  
		HALF_PAID_LEAVE("Half Paid Leave"),
		
		// deduction in pay slip
		LOSS_OF_PAY("Loss of Pay"),
		HALF_LOSS_OF_PAY("Half Loss of Pay");
		

		private String status;

		private AttendanceStatus(String status) {
			this.status = status;
		}

		public String value() {
			return this.status;
		}
	}
	
	public enum LeaveRequestStatus {
		APPROVED("Approved"), 
		REJECTED("Rejected"),
		PENDING("Pending");

		private String status;

		private LeaveRequestStatus(String status) {
			this.status = status;
		}

		public String value() {
			return this.status;
		}
	}
	
    public enum JobPostingStatus {
		
		OPEN("Open"),
		CLOSE("Close");

		private String status;

		private JobPostingStatus(String status) {
			this.status = status;
		}

		public String value() {
			return this.status;
		}
		
	}

}
