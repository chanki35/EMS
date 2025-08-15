package com.hrms.service;

import java.util.List;

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
import com.hrms.dto.AddDesignationRequest;
import com.hrms.dto.CommonApiResponse;
import com.hrms.dto.DesignationResponseDto;
import com.hrms.entity.Company;
import com.hrms.entity.Department;
import com.hrms.entity.Designation;
import com.hrms.utility.Constants.ActiveStatus;
import com.hrms.utility.Constants.ProjectManagerPresentStatus;

@Service
public class DesignationService {

	private final Logger LOG = LoggerFactory.getLogger(DesignationService.class);

	@Autowired
	private DesignationDao designationDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private DepartmentDao departmentDao;

	public ResponseEntity<CommonApiResponse> addDesignation(AddDesignationRequest request) {

		LOG.info("Request received for add designation");

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

		if (request.getDepartmentId() == 0) {
			response.setResponseMessage("company department Id missing");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Company company = companyDao.findById(request.getCompanyId()).orElse(null);

		if (company == null) {
			response.setResponseMessage("Company not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Department department = this.departmentDao.findById(request.getDepartmentId()).orElse(null);

		if (department == null) {
			response.setResponseMessage("Department not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (company.getId() != department.getCompany().getId()) {
			response.setResponseMessage("Company and Department not mismatch..!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Designation designation = new Designation();
		designation.setName(request.getName());
		designation.setDescription(request.getDescription());
		designation.setDepartment(department);
		designation.setCompany(company);
		designation.setStatus(ActiveStatus.ACTIVE.value());

		Designation addDesignation = designationDao.save(designation);

		if (addDesignation == null) {
			response.setResponseMessage("Failed to add Designation!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		response.setResponseMessage("Designation Added Successful");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);

	}

	public ResponseEntity<CommonApiResponse> updateDesignation(AddDesignationRequest request) {

		LOG.info("Request received for updating designation");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("missing input");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getId() == 0) {
			response.setResponseMessage("designation id missing");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Designation exisitingDesignation = this.designationDao.findById(request.getId()).orElse(null);

		if (exisitingDesignation == null) {
			response.setResponseMessage("designation id missing");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		exisitingDesignation.setName(request.getName());
		exisitingDesignation.setDescription(request.getDescription());
		exisitingDesignation.setStatus(ActiveStatus.ACTIVE.value());

		// this means HR is trying to update the department, otherwise it will be same
		if (request.getDepartmentId() != 0
				&& request.getDepartmentId() != exisitingDesignation.getDepartment().getId()) {

			Department department = this.departmentDao.findById(request.getDepartmentId()).orElse(null);
			exisitingDesignation.setDepartment(department);

		}

		Designation addDesignation = designationDao.save(exisitingDesignation);

		if (addDesignation == null) {
			response.setResponseMessage("Failed to update Designation!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		response.setResponseMessage("Designation Updated Successful");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);

	}

	public ResponseEntity<DesignationResponseDto> fetchAllDesignationByCompany(int companyId) {

		LOG.info("Request received for fetching designations by company");

		DesignationResponseDto response = new DesignationResponseDto();

		if (companyId == 0) {
			response.setResponseMessage("company id missing");
			response.setSuccess(false);

			return new ResponseEntity<DesignationResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		Company company = this.companyDao.findById(companyId).orElse(null);

		if (company == null) {
			response.setResponseMessage("company not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<DesignationResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<Designation> designations = this.designationDao.findByCompany(company);

		if (CollectionUtils.isEmpty(designations)) {
			response.setResponseMessage("Designations fetched Successful!!!");
			response.setSuccess(false);

			return new ResponseEntity<DesignationResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		response.setDesignations(designations);
		response.setResponseMessage("Designation fetched Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<DesignationResponseDto>(response, HttpStatus.OK);

	}

	public ResponseEntity<CommonApiResponse> deleteDesignation(int designationId) {

		LOG.info("Request received for deleting the designation");

		CommonApiResponse response = new CommonApiResponse();

		if (designationId == 0) {
			response.setResponseMessage("designation id missing");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Designation designation = this.designationDao.findById(designationId).orElse(null);

		if (designation == null) {
			response.setResponseMessage("designation not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		designation.setStatus(ActiveStatus.DEACTIVATED.value());

		Designation deletedDesignation = this.designationDao.save(designation);

		if (deletedDesignation == null) {
			response.setResponseMessage("Failed to delete Designation!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		response.setResponseMessage("Designation deleted Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);

	}

	public ResponseEntity<DesignationResponseDto> fetchAllDesignationByCompanyAndDepartmentId(int companyId,
			int departmentId) {

		LOG.info("Request received for fetching the designations by company and department id");

		DesignationResponseDto response = new DesignationResponseDto();

		if (companyId == 0 || departmentId == 0) {
			response.setResponseMessage("company id or department id is missing");
			response.setSuccess(false);

			return new ResponseEntity<DesignationResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		Company company = this.companyDao.findById(companyId).orElse(null);

		if (company == null) {
			response.setResponseMessage("company not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<DesignationResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		Department department = this.departmentDao.findById(departmentId).orElse(null);

		if (department == null) {
			response.setResponseMessage("department not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<DesignationResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<Designation> designations = this.designationDao.findByCompanyAndDepartmentAndStatus(company, department, ActiveStatus.ACTIVE.value());

		if (CollectionUtils.isEmpty(designations)) {
			response.setProjectManagerPresent(ProjectManagerPresentStatus.NO.value());
			response.setResponseMessage("Designations fetched Successful!!!");
			response.setSuccess(false);

			return new ResponseEntity<DesignationResponseDto>(response, HttpStatus.OK);
		}

		boolean flag = designations.stream()
				.anyMatch(d -> d.getName().equals(com.hrms.utility.Constants.Designation.PROJECT_MANAGER.value()));

		if (flag)
			response.setProjectManagerPresent(ProjectManagerPresentStatus.YES.value());
		else
			response.setProjectManagerPresent(ProjectManagerPresentStatus.NO.value());

		response.setDesignations(designations);
		response.setResponseMessage("Designation fetched Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<DesignationResponseDto>(response, HttpStatus.OK);

	}

}
