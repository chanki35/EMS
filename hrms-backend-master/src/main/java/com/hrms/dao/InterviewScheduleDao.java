package com.hrms.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hrms.entity.InterviewSchedule;

@Repository
public interface InterviewScheduleDao extends JpaRepository<InterviewSchedule, Integer> {
	
}
