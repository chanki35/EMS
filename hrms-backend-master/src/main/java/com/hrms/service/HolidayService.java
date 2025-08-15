package com.hrms.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.hrms.dao.CompanyDao;
import com.hrms.dao.HolidayDao;
import com.hrms.dto.CommonApiResponse;
import com.hrms.dto.HolidayRequestDto;
import com.hrms.dto.HolidayResponseDto;
import com.hrms.entity.Company;
import com.hrms.entity.Holiday;

@Service
public class HolidayService {

	@Autowired
	private HolidayDao holidayDao;

	@Autowired
	private CompanyDao companyDao;

	public ResponseEntity<CommonApiResponse> addHoliday(HolidayRequestDto holidayRequestDto) {
		CommonApiResponse response = new CommonApiResponse();

		if (holidayRequestDto == null) {
			response.setSuccess(false);
			response.setResponseMessage("request body missing!!!");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		Company company = companyDao.findById(holidayRequestDto.getCompanyId()).orElse(null);

		if (company == null) {
			response.setSuccess(false);
			response.setResponseMessage("Company not found!");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		Holiday holiday = new Holiday();
		holiday.setDate(holidayRequestDto.getDate());
		holiday.setName(holidayRequestDto.getName());
		holiday.setDescription(holidayRequestDto.getDescription());
		holiday.setCreatedDate(String.valueOf(System.currentTimeMillis()));
		holiday.setCompany(company);

		holidayDao.save(holiday);

		response.setSuccess(true);
		response.setResponseMessage("Holiday added successfully!");
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<HolidayResponseDto> getHolidaysByCompany(int companyId) {
		HolidayResponseDto response = new HolidayResponseDto();

		if (companyId == 0) {
			response.setSuccess(false);
			response.setResponseMessage("Company Id missing!!!");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		Company company = companyDao.findById(companyId).orElse(null);
		if (company == null) {
			response.setSuccess(false);
			response.setResponseMessage("Company not found!");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		List<Holiday> holidays = holidayDao.findByCompany(company);

		if (CollectionUtils.isEmpty(holidays)) {
			response.setSuccess(false);
			response.setResponseMessage("Holidays not found!!!");

			return new ResponseEntity<>(response, HttpStatus.OK);
		}

		response.setSuccess(true);
		response.setResponseMessage("Holidays retrieved successfully!");
		response.setHolidays(holidays);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateHoliday(int holidayId, HolidayRequestDto holidayRequestDto) {
		CommonApiResponse response = new CommonApiResponse();

		if (holidayId == 0) {
			response.setSuccess(false);
			response.setResponseMessage("Holiday Id missing!!!");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		Holiday holiday = holidayDao.findById(holidayId).orElse(null);
		if (holiday == null) {
			response.setSuccess(false);
			response.setResponseMessage("Holiday not found!");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		holiday.setDate(holidayRequestDto.getDate());
		holiday.setName(holidayRequestDto.getName());
		holiday.setDescription(holidayRequestDto.getDescription());
		holidayDao.save(holiday);

		response.setSuccess(true);
		response.setResponseMessage("Holiday updated successfully!");
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> deleteHoliday(int holidayId) {
		CommonApiResponse response = new CommonApiResponse();

		if (holidayId == 0) {
			response.setSuccess(false);
			response.setResponseMessage("Holiday Id missing!!!");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		Holiday holiday = holidayDao.findById(holidayId).orElse(null);
		if (holiday == null) {
			response.setSuccess(false);
			response.setResponseMessage("Holiday not found!");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		holidayDao.delete(holiday);

		response.setSuccess(true);
		response.setResponseMessage("Holiday deleted successfully!");
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
