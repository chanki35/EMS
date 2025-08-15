package com.hrms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.hrms.dao.CompanyDao;
import com.hrms.dao.DepartmentDao;
import com.hrms.dao.DesignationDao;
import com.hrms.dao.EmployeeDao;
import com.hrms.dto.AddDepartmentRequest;
import com.hrms.dto.CommonApiResponse;
import com.hrms.dto.DepartmentResponseDto;
import com.hrms.entity.Company;
import com.hrms.entity.Department;
import com.hrms.entity.Designation;
import com.hrms.entity.Employee;
import com.hrms.utility.Constants;
import com.hrms.utility.Constants.ActiveStatus;

@Service
public class DepartmentService {

	private final Logger LOG = LoggerFactory.getLogger(DepartmentService.class);

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private DesignationDao designationDao;

	@Autowired
	private EmployeeDao employeeDao;

	public ResponseEntity<CommonApiResponse> addDepartment(AddDepartmentRequest request) {

		LOG.info("Request received for add department");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("missing input");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getCompanyId() == 0) {
			response.setResponseMessage("company id missing");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Company company = companyDao.findById(request.getCompanyId()).orElse(null);

		if (company == null) {
			response.setResponseMessage("Company not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Department department = new Department();
		department.setName(request.getName());
		department.setDescription(request.getDescription());
		department.setCompany(company);
		department.setStatus(ActiveStatus.ACTIVE.value());

		Department addDepartment = departmentDao.save(department);

		if (addDepartment == null) {
			response.setResponseMessage("Failed to add Department!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		Designation designation = new Designation();
		designation.setCompany(company);
		designation.setDepartment(addDepartment);
		designation.setDescription(Constants.PROJECT_MANAGER_DESCRIPTION);
		designation.setName(com.hrms.utility.Constants.Designation.PROJECT_MANAGER.value());
		designation.setStatus(ActiveStatus.ACTIVE.value());

		designationDao.save(designation);

		response.setResponseMessage("Department Added Successful");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);

	}

	public ResponseEntity<CommonApiResponse> updateDepartment(AddDepartmentRequest request) {

		LOG.info("Request received for updating department");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("missing input");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getId() == 0) {
			response.setResponseMessage("department id missing");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Department exisitingDepartment = this.departmentDao.findById(request.getId()).orElse(null);

		if (exisitingDepartment == null) {
			response.setResponseMessage("Department not found!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		exisitingDepartment.setName(request.getName());
		exisitingDepartment.setDescription(request.getDescription());

		Department addedDepartment = departmentDao.save(exisitingDepartment);

		if (addedDepartment == null) {
			response.setResponseMessage("Failed to update Department!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		response.setResponseMessage("Department Updated Successful");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);

	}

	public ResponseEntity<DepartmentResponseDto> fetchAllDepartmentByCompany(int companyId) {

		LOG.info("Request received for fetching department by company");

		DepartmentResponseDto response = new DepartmentResponseDto();

		if (companyId == 0) {
			response.setResponseMessage("company id missing");
			response.setSuccess(false);

			return new ResponseEntity<DepartmentResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		Company company = this.companyDao.findById(companyId).orElse(null);

		if (company == null) {
			response.setResponseMessage("company not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<DepartmentResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<Department> departments = this.departmentDao.findByCompanyAndStatus(company, ActiveStatus.ACTIVE.value());

		if (CollectionUtils.isEmpty(departments)) {
			response.setResponseMessage("Departments fetched Successful!!!");
			response.setSuccess(false);

			return new ResponseEntity<DepartmentResponseDto>(response, HttpStatus.OK);
		}

		// Use Streams API to set project managers for each department
		departments = departments.stream().peek(department -> {
			Designation designation = this.designationDao.findByCompanyAndDepartmentAndName(company, department,
					com.hrms.utility.Constants.Designation.PROJECT_MANAGER.value());
			Employee managerEmployee = this.employeeDao.findByDesignation(designation);
			if (managerEmployee != null) {
				department.setProjectManagerPresent("Yes");
				department.setProjectManagerId(managerEmployee.getEmployeeUser().getId());
			} else {
				department.setProjectManagerPresent("No");
			}
		}).collect(Collectors.toList());

		response.setDepartments(departments);
		response.setResponseMessage("Departments fetched Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<DepartmentResponseDto>(response, HttpStatus.OK);

	}

	public ResponseEntity<CommonApiResponse> deleteDepartment(int departmentId) {

		LOG.info("Request received for deleting the department");

		CommonApiResponse response = new CommonApiResponse();

		if (departmentId == 0) {
			response.setResponseMessage("department id missing");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Department department = this.departmentDao.findById(departmentId).orElse(null);

		if (department == null) {
			response.setResponseMessage("department not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		department.setStatus(ActiveStatus.DEACTIVATED.value());

		Department deletedDepartment = this.departmentDao.save(department);

		if (deletedDepartment == null) {
			response.setResponseMessage("Failed to delete Department!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		response.setResponseMessage("Department deleted Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);

	}

}
