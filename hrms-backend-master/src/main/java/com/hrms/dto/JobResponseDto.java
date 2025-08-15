package com.hrms.dto;

import java.util.ArrayList;
import java.util.List;

import com.hrms.entity.JobPosting;

import lombok.Data;

@Data
public class JobResponseDto extends CommonApiResponse {

	private List<JobPosting> jobPostings = new ArrayList<>();

}
