package com.hrms.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.hrms.dao.CompanyDao;
import com.hrms.dao.UserDao;
import com.hrms.dto.AddCompanyRequest;
import com.hrms.dto.CommonApiResponse;
import com.hrms.dto.CompanyResponse;
import com.hrms.entity.Company;
import com.hrms.entity.User;
import com.hrms.utility.Constants.CompanyStatus;
import com.hrms.utility.Constants.UserRole;

@Service
public class CompanyService {

	private final Logger LOG = LoggerFactory.getLogger(CompanyService.class);

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private UserDao userDao;

	public ResponseEntity<CompanyResponse> registerCompany(AddCompanyRequest request) {

		LOG.info("Received request for adding the company");

		String currentTime = String
				.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

		CompanyResponse response = new CompanyResponse();

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CompanyResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getUserId() == 0) {
			response.setResponseMessage("missing user id!!!");
			response.setSuccess(false);

			return new ResponseEntity<CompanyResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User companyUser = this.userDao.findById(request.getUserId()).orElse(null);

		if (companyUser == null || !companyUser.getRole().equals(UserRole.ROLE_COMPANY_ADMIN.value())) {
			response.setResponseMessage("Company User not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CompanyResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Company company = AddCompanyRequest.toCompanyEntity(request);

		if (company == null) {
			response.setResponseMessage("Internal error, object null!!!");
			response.setSuccess(false);

			return new ResponseEntity<CompanyResponse>(response, HttpStatus.BAD_REQUEST);
		}

		company.setStatus(CompanyStatus.PENDING.value());
		company.setCreatedDate(currentTime);

		Company addedCompany = this.companyDao.save(company);

		if (addedCompany == null) {
			response.setResponseMessage("Failed to add the company!!!");
			response.setSuccess(false);

			return new ResponseEntity<CompanyResponse>(response, HttpStatus.BAD_REQUEST);
		}

		companyUser.setCompany(addedCompany);
		this.userDao.save(companyUser);

		response.setCompanies(Arrays.asList(addedCompany));
		response.setResponseMessage("Company Registered succesful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CompanyResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateCompanyStatus(int companyId, String status) {

		CommonApiResponse response = new CommonApiResponse();

		if (companyId == 0 || status == null) {
			response.setResponseMessage("missing input");
			response.setSuccess(false);
			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Company company = this.companyDao.findById(companyId).orElse(null);

		if (company == null) {
			response.setResponseMessage("company not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		company.setStatus(status);
		this.companyDao.save(company);

		response.setResponseMessage("Company status updated successful!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CompanyResponse> fetchCompanyByStatus(String status) {

		CompanyResponse response = new CompanyResponse();

		if (status == null) {
			response.setResponseMessage("missing input");
			response.setSuccess(false);
			return new ResponseEntity<CompanyResponse>(response, HttpStatus.BAD_REQUEST);
		}

		List<Company> companies = this.companyDao.findByStatus(status);

		if (org.springframework.util.CollectionUtils.isEmpty(companies)) {
			response.setResponseMessage("Companies not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<CompanyResponse>(response, HttpStatus.OK);
		}

		response.setCompanies(companies);
		response.setResponseMessage("Companies Fetched Succcessful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CompanyResponse>(response, HttpStatus.OK);

	}

}
