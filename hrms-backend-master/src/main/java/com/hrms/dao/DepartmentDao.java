package com.hrms.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hrms.entity.Company;
import com.hrms.entity.Department;

@Repository
public interface DepartmentDao extends JpaRepository<Department, Integer> {

	List<Department> findByCompanyAndStatus(Company company, String status);

}
