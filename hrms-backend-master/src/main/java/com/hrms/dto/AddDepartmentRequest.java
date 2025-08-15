package com.hrms.dto;

import lombok.Data;

@Data
public class AddDepartmentRequest {

	private int id;

	private String name;

	private String description;

	private int companyId;

}
