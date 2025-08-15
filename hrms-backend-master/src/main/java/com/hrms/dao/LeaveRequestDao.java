package com.hrms.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hrms.entity.LeaveRequest;
import com.hrms.entity.User;

@Repository
public interface LeaveRequestDao extends JpaRepository<LeaveRequest, Integer> {

	List<LeaveRequest> findByEmployee(User employee);

	List<LeaveRequest> findByManager(User manager);
	
}
