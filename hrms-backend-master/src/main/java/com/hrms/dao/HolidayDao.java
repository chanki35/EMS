package com.hrms.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hrms.entity.Company;
import com.hrms.entity.Holiday;

@Repository
public interface HolidayDao extends JpaRepository<Holiday, Integer> {

	List<Holiday> findByCompany(Company company);

	List<Holiday> findByCompanyAndDateContainingIgnoreCase(Company company, String date);

}
