package com.hrms.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hrms.entity.Company;
import com.hrms.entity.Department;
import com.hrms.entity.Designation;

@Repository
public interface DesignationDao extends JpaRepository<Designation, Integer> {

	List<Designation> findByCompany(Company company);

	List<Designation> findByCompanyAndDepartmentAndStatus(Company company, Department department, String status);

	Designation findByCompanyAndDepartmentAndName(Company company, Department department, String name);

	Designation findByDepartmentAndName(Department department, String name);

}
