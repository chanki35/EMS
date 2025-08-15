package com.hrms.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hrms.entity.Attendance;
import com.hrms.entity.Company;
import com.hrms.entity.User;

@Repository
public interface AttendanceDao extends JpaRepository<Attendance, Integer> {

	Attendance findByEmployeeUserAndDate(User employee, String string);

	List<Attendance> findByCompanyAndDateAndWorkingStatus(Company company, String string, String status);
	
	List<Attendance> findByEmployeeUserAndDateContainingIgnoreCaseAndWorkingStatus(User employeeUser, String string, String status);
	
	List<Attendance> findByEmployeeUserAndDateContainingIgnoreCase(User employeeUser, String date);

}
