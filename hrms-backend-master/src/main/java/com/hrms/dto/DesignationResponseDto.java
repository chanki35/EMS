package com.hrms.dto;

import java.util.ArrayList;
import java.util.List;

import com.hrms.entity.Designation;

import lombok.Data;

@Data
public class DesignationResponseDto extends CommonApiResponse {

	private List<Designation> designations = new ArrayList<>();

	private String projectManagerPresent;

}
