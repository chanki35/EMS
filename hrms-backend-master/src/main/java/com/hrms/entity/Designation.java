package com.hrms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class Designation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String name; // 1 designation will be common which is Project Manager

	private String description;

	@ManyToOne
	@JoinColumn(name = "department_id", nullable = false)
	private Department department; // Associated department

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "company_id", nullable = false)
	private Company company; // Associated company

	private String status;

}
