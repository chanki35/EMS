package com.hrms.dto;

import java.util.ArrayList;
import java.util.List;

import com.hrms.entity.Payslip;

import lombok.Data;

@Data
public class PaySlipResponseDto extends CommonApiResponse {

	private List<Payslip> payslips = new ArrayList<>();

}
