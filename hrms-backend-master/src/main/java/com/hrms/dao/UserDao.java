package com.hrms.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hrms.entity.Company;
import com.hrms.entity.Designation;
import com.hrms.entity.User;

@Repository
public interface UserDao extends JpaRepository<User, Integer> {

	User findByEmailId(String email);

	User findByEmailIdAndStatus(String email, String status);

	User findByRoleAndStatusIn(String role, List<String> status);

	List<User> findByRole(String role);

	User findByEmailIdAndRoleAndStatus(String emailId, String role, String status);

	List<User> findByRoleAndStatus(String role, String status);

	List<User> findByRoleAndStatusAndCompanyIdAndFirstNameContainingIgnoreCase(String role, String value, int companyId,
			String firstName);

	List<User> findByRoleAndStatusAndCompanyId(String role, String status, int companyId);

	List<User> findByStatusAndCompanyId(String value, int companyId);

	@Query("SELECT u FROM User u WHERE u.employee.designation=:designation")
	List<User> findByDesignation(@Param("designation") Designation designation);
	
	@Query("SELECT u FROM User u WHERE u.employee.reportingManager=:reportingManager")
	List<User> findByEmployeeReportingManager(@Param("reportingManager") User reportingManager);

}
