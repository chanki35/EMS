package com.hrms.dto;

import java.util.ArrayList;
import java.util.List;

import com.hrms.entity.Holiday;

import lombok.Data;

@Data
public class HolidayResponseDto extends CommonApiResponse {

	private List<Holiday> holidays = new ArrayList<>();
	
}
