package com.hrms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class InterviewSchedule {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@ManyToOne
	@JoinColumn(name = "candidate_id", nullable = false)
	private Candidate candidate; // Candidate for the interview

	@ManyToOne
	@JoinColumn(name = "interviewer_id", nullable = false)
	private User interviewer; // Employee conducting the interview

	@ManyToOne
	@JoinColumn(name = "hr_id", nullable = false)
	private User hr; // HR overseeing the interview

	@ManyToOne
	@JoinColumn(name = "job_posting_id", nullable = false)
	private JobPosting jobPosting; // Job the interview is for

	private String interviewName; // E.g., L1, L2, HR Round
	private String interviewTime; // Scheduled time of the interview
	private String addedDate; // Date the interview was scheduled
	private String modifiedDate; // Last updated timestamp

	private String meetingLink; // Link for virtual interviews
	private String mode; // Virtual or Office
	private String officeAddress; // Office address if mode is Office

	private String status; // E.g., Scheduled, Completed, Cancelled

	@ManyToOne
	@JoinColumn(name = "company_id")
	private Company company;

}
