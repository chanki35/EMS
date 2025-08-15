package com.hrms.dto;

import lombok.Data;

@Data
public class AddDesignationRequest {
	
	private int id;

	private String name; // 1 designation will be common which is Project Manager

	private int departmentId;

	private int companyId;

	private String description;

}
