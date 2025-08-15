package com.hrms.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hrms.entity.Candidate;

@Repository
public interface CandidateDao extends JpaRepository<Candidate, Integer> {
	
}