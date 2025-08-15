package com.hrms.dto;

import java.util.ArrayList;
import java.util.List;

import com.hrms.entity.Attendance;

import lombok.Data;

@Data
public class AttendanceResponseDto extends CommonApiResponse {

	private List<Attendance> attendances = new ArrayList<>();

}
