package com.hrms.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hrms.entity.Company;

@Repository
public interface CompanyDao extends JpaRepository<Company, Integer> {

	List<Company> findByStatus(String status);

}