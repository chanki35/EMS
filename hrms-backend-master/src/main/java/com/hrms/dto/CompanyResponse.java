package com.hrms.dto;

import java.util.ArrayList;
import java.util.List;

import com.hrms.entity.Company;

import lombok.Data;

@Data
public class CompanyResponse extends CommonApiResponse {

	private List<Company> companies = new ArrayList<>();

}
