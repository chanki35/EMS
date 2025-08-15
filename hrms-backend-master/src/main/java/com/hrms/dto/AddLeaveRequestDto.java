package com.hrms.dto;

import lombok.Data;

@Data
public class AddLeaveRequestDto {

	private int employeeUserId; // from User Id

	private String date;

	private String reason;

}
