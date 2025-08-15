package com.hrms.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hrms.entity.Company;
import com.hrms.entity.JobPosting;

@Repository
public interface JobPostingDao extends JpaRepository<JobPosting, Integer> {

	List<JobPosting> findByCompanyAndStatus(Company companyId, String status);
	
}