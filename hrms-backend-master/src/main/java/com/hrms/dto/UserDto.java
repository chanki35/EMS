package com.hrms.dto;

import org.springframework.beans.BeanUtils;

import com.hrms.entity.Company;
import com.hrms.entity.Employee;
import com.hrms.entity.User;

import lombok.Data;

@Data
public class UserDto {

	private int id;

	private String firstName;

	private String lastName;

	private String emailId;

	private String phoneNo;

	private String role;

	private String status;

	private Company company;

	private Employee employee;

	public static UserDto toUserDtoEntity(User user) {
		UserDto userDto = new UserDto();
		BeanUtils.copyProperties(user, userDto);
		return userDto;
	}

}
