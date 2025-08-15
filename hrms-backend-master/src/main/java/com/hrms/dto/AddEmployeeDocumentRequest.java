package com.hrms.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class AddEmployeeDocumentRequest {

	private int id; // employee id entity

	// Documents
	private MultipartFile resumeFile;

	private MultipartFile governmentProofImage;

	private MultipartFile profileImage;

}
