package com.hrms.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hrms.entity.Employee;
import com.hrms.entity.Payslip;

@Repository
public interface PayslipDao extends JpaRepository<Payslip, Integer> {

	List<Payslip> findByEmployee(Employee employee);

}
