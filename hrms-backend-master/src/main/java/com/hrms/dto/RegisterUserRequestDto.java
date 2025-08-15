package com.hrms.dto;

import org.springframework.beans.BeanUtils;

import com.hrms.entity.User;

import lombok.Data;

@Data
public class RegisterUserRequestDto {

	private String firstName;

	private String lastName;

	private String emailId;

	private String password;

	private String phoneNo;

	private String role;

	private int companyId;

	public static User toUserEntity(RegisterUserRequestDto registerUserRequestDto) {
		User user = new User();
		BeanUtils.copyProperties(registerUserRequestDto, user, "companyId");
		return user;
	}

}
