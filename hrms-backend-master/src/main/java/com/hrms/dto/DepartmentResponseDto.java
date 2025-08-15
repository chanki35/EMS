package com.hrms.dto;

import java.util.ArrayList;
import java.util.List;

import com.hrms.entity.Department;

import lombok.Data;

@Data
public class DepartmentResponseDto extends CommonApiResponse {

	private List<Department> departments = new ArrayList<>();

}
