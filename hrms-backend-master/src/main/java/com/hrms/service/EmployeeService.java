package com.hrms.service;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.FileCopyUtils;

import com.hrms.dao.DepartmentDao;
import com.hrms.dao.DesignationDao;
import com.hrms.dao.EmployeeDao;
import com.hrms.dao.UserDao;
import com.hrms.dto.AddEmployeeDocumentRequest;
import com.hrms.dto.AddEmployeeRequest;
import com.hrms.dto.CommonApiResponse;
import com.hrms.entity.Department;
import com.hrms.entity.Designation;
import com.hrms.entity.Employee;
import com.hrms.entity.User;
import com.hrms.exception.UserSaveFailedException;
import com.hrms.utility.Constants.ActiveStatus;
import com.hrms.utility.Constants.EmployeementStatus;
import com.hrms.utility.StorageService;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;

@Service
public class EmployeeService {

	private final Logger LOG = LoggerFactory.getLogger(EmployeeService.class);

	@Autowired
	private UserDao userDao;

	@Autowired
	private EmployeeDao employeeDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private DesignationDao designationDao;

	@Autowired
	private StorageService storageService;

	@Transactional
	public ResponseEntity<CommonApiResponse> addEmployee(AddEmployeeRequest request) {

		LOG.info("Received request for register user");

		String currentTime = String
				.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getEmployeeUserId() == 0) {
			response.setResponseMessage("Employee User not registered in our system!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User employeeUser = this.userDao.findById(request.getEmployeeUserId()).orElse(null);

		if (employeeUser == null) {
			response.setResponseMessage("Employee User not registered in our system!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getDesignationId() == 0) {
			response.setResponseMessage("designation is missing");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Designation designation = this.designationDao.findById(request.getDesignationId()).orElse(null);

		if (designation == null) {
			response.setResponseMessage("designation not found!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User reportingManager = null;

		// if selected designation is not project manager
		if (!designation.getName().equals(com.hrms.utility.Constants.Designation.PROJECT_MANAGER.value())) {

			Designation managerDesignation = this.designationDao.findByDepartmentAndName(designation.getDepartment(),
					com.hrms.utility.Constants.Designation.PROJECT_MANAGER.value());

			if (managerDesignation == null) {
				response.setResponseMessage("Manager not found for Department!!!");
				response.setSuccess(false);

				return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
			}

			List<User> managerUsers = this.userDao.findByDesignation(managerDesignation);

			if (CollectionUtils.isEmpty(managerUsers)) {
				response.setResponseMessage("Manager not found for Department!!!");
				response.setSuccess(false);

				return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
			}

			reportingManager = managerUsers.get(0);
		} else { // selected designation is Project Manager
			Designation managerDesignation = this.designationDao.findByDepartmentAndName(designation.getDepartment(),
					com.hrms.utility.Constants.Designation.PROJECT_MANAGER.value());

			if (managerDesignation == null) {
				response.setResponseMessage("Manager not found for Department!!!");
				response.setSuccess(false);

				return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
			}

			List<User> managerUsers = this.userDao.findByDesignation(designation);

			if (!CollectionUtils.isEmpty(managerUsers)) {
				response.setResponseMessage("Project Manager already assigned for Department "+designation.getDepartment().getName());
				response.setSuccess(false);

				return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
			}
		}

		if (request.getHrId() == 0) {
			response.setResponseMessage("HR not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User hr = this.userDao.findById(request.getHrId()).orElse(null);

		if (hr == null) {
			response.setResponseMessage("HR not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getDepartmentId() == 0) {
			response.setResponseMessage("Department not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Department department = this.departmentDao.findById(request.getDepartmentId()).orElse(null);

		if (department == null) {
			response.setResponseMessage("Department not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (!designation.getName().equals(com.hrms.utility.Constants.Designation.PROJECT_MANAGER.value()) && department.getId() != reportingManager.getEmployee().getDepartment().getId()) {
			response.setResponseMessage("Manager & Employee Department mismatch!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Employee employee = AddEmployeeRequest.toEmployeeEntity(request);
		employee.setHr(hr);
		employee.setDepartment(department);
		employee.setDesignation(designation);
		employee.setCreatedDate(currentTime);
		employee.setEmploymentStatus(EmployeementStatus.ACTIVE.value());
		employee.setEmployeeUser(employeeUser);

		if (!designation.getName().equals(com.hrms.utility.Constants.Designation.PROJECT_MANAGER.value())) {
			employee.setReportingManager(reportingManager);
		}

		Employee savedEmployee = this.employeeDao.save(employee);

		if (savedEmployee == null) {
			response.setResponseMessage("Failed to save the employee!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		employeeUser.setEmployee(savedEmployee);

		User updatedUser = this.userDao.save(employeeUser);

		if (updatedUser == null) {
			throw new UserSaveFailedException("Failed to save Employee!!!");
		}

		response.setResponseMessage("Employee details saved Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateEmployeeSalaryDetail(AddEmployeeRequest request) {

		LOG.info("Received request for updating the salary detail of emloyee!!!");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null || request.getId() == 0) {
			response.setResponseMessage("bad request, invalid request body!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Employee employee = this.employeeDao.findById(request.getId()).orElse(null);

		if (employee == null) {
			response.setResponseMessage("Employee not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		// Update salary details from request object
		employee.setCtc(request.getCtc());
		employee.setBasicSalary(request.getBasicSalary());
		employee.setHra(request.getHra());
		employee.setLta(request.getLta());
		employee.setConveyanceAllowance(request.getConveyanceAllowance());
		employee.setRetentionAllowance(request.getRetentionAllowance());
		employee.setMobileAllowance(request.getMobileAllowance());
		employee.setProvidentFund(request.getProvidentFund());
		employee.setProfessionTax(request.getProfessionTax());
		employee.setTds(request.getTds());

		// Update extra day pay details
		employee.setExtraDayPayBase(request.getExtraDayPayBase());
		employee.setExtraDayPayHra(request.getExtraDayPayHra());
		employee.setExtraDayPayConveyanceAllowance(request.getExtraDayPayConveyanceAllowance());
		employee.setExtraDayPayRetentionAllowance(request.getExtraDayPayRetentionAllowance());
		employee.setExtraDayPayPf(request.getExtraDayPayPf());
		employee.setExtraDayPayTds(request.getExtraDayPayTds());

		// Update absent day deductions
		employee.setAbsentDayPayBase(request.getAbsentDayPayBase());
		employee.setAbsentDayPayHra(request.getAbsentDayPayHra());
		employee.setAbsentDayPayConveyanceAllowance(request.getAbsentDayPayConveyanceAllowance());
		employee.setAbsentDayPayRetentionAllowance(request.getAbsentDayPayRetentionAllowance());
		employee.setAbsentDayPayPf(request.getAbsentDayPayPf());
		employee.setAbsentDayPayTds(request.getAbsentDayPayTds());

		Employee updatedEmployee = this.employeeDao.save(employee);

		if (updatedEmployee == null) {
			response.setResponseMessage("Failed to update the Employee Salary Detail...");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Employee Salary Detail updated Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateEmployeeDocument(AddEmployeeDocumentRequest request) {

		LOG.info("Received request for updating the employee document!!!");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null || request.getId() == 0) {
			response.setResponseMessage("bad request, invalid request body!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Employee employee = this.employeeDao.findById(request.getId()).orElse(null);

		if (employee == null) {
			response.setResponseMessage("Employee not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		String resumeFileName = this.storageService.store(request.getResumeFile());
		String governmentProofImageName = this.storageService.store(request.getGovernmentProofImage());
		String profileImageName = this.storageService.store(request.getProfileImage());

		employee.setProfileImage(profileImageName);
		employee.setGovernmentProofFileImage(governmentProofImageName);
		employee.setResumeFileName(resumeFileName);

		Employee updatedEmployee = this.employeeDao.save(employee);

		if (updatedEmployee == null) {
			response.setResponseMessage("Failed to add the Employee Document...");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Employee Document added Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateEmployeeBankAccountDetails(AddEmployeeRequest request) {
		LOG.info("Received request for updating bank account and provident fund details of employee!");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null || request.getId() == 0) {
			response.setResponseMessage("Bad request, invalid request body!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		Employee employee = this.employeeDao.findById(request.getId()).orElse(null);

		if (employee == null) {
			response.setResponseMessage("Employee not found!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		// Update provident fund details
		employee.setPfNo(request.getPfNo());
		employee.setUan(request.getUan());

		// Update bank account details
		employee.setBankName(request.getBankName());
		employee.setBankAccountNumber(request.getBankAccountNumber());
		employee.setIfscCode(request.getIfscCode());
		employee.setPanNumber(request.getPanNumber());
		employee.setAadhaarNumber(request.getAadhaarNumber());

		Employee updatedEmployee = this.employeeDao.save(employee);

		if (updatedEmployee == null) {
			response.setResponseMessage("Failed to update the Employee Bank Account and Provident Fund Details...");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Employee Bank Account and Provident Fund Details updated successfully!");
		response.setSuccess(true);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateEmployeePersonalDetail(AddEmployeeRequest request) {

		LOG.info("Received request for updating the personal, address, and emergency contact details of employee!!!");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null || request.getId() == 0) {
			response.setResponseMessage("Bad request, invalid request body!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		Employee employee = this.employeeDao.findById(request.getId()).orElse(null);

		if (employee == null) {
			response.setResponseMessage("Employee not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		// Update Personal Information
		employee.setFirstName(request.getFirstName());
		employee.setLastName(request.getLastName());
		employee.setEmailId(request.getEmailId());
		employee.setPhoneNo(request.getPhoneNo());
		employee.setGender(request.getGender());
		employee.setDateOfBirth(request.getDateOfBirth());
		employee.setMaritalStatus(request.getMaritalStatus());
		employee.setBloodGroup(request.getBloodGroup());

		// Update Address Information
		employee.setPermanentAddress(request.getPermanentAddress());
		employee.setCurrentAddress(request.getCurrentAddress());
		employee.setCity(request.getCity());
		employee.setState(request.getState());
		employee.setPostalCode(request.getPostalCode());

		// Update Emergency Contact
		employee.setEmergencyContactName(request.getEmergencyContactName());
		employee.setEmergencyContactPhone(request.getEmergencyContactPhone());
		employee.setEmergencyContactRelation(request.getEmergencyContactRelation());

		Employee updatedEmployee = this.employeeDao.save(employee);

		if (updatedEmployee == null) {
			response.setResponseMessage("Failed to update the Employee Personal Details...");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Employee Personal Details updated successfully!!!");
		response.setSuccess(true);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateEmployeeDesignation(int employeeId, int designationId) {

		LOG.info("Received request to update designation for employeeId: {} with designationId: {}", employeeId,
				designationId);

		CommonApiResponse response = new CommonApiResponse();

		// Validate employee
		Employee employee = this.employeeDao.findById(employeeId).orElse(null);
		if (employee == null) {
			response.setResponseMessage("Employee not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		// Validate designation
		Designation designation = this.designationDao.findById(designationId).orElse(null);
		if (designation == null) {
			response.setResponseMessage("Designation not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		// Update designation
		employee.setDesignation(designation);
		Employee updatedEmployee = this.employeeDao.save(employee);

		if (updatedEmployee == null) {
			response.setResponseMessage("Failed to update the Employee Designation...");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Employee Designation updated successfully!!!");
		response.setSuccess(true);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateEmployeeDepartmentAndDesignation(int employeeId, int departmentId,
			int designationId, int reportingManagerId) {

		LOG.info(
				"Received request to update department and designation for employeeId: {}, departmentId: {}, designationId: {}",
				employeeId, departmentId, designationId);

		CommonApiResponse response = new CommonApiResponse();

		// Validate employee
		Employee employee = this.employeeDao.findById(employeeId).orElse(null);
		if (employee == null) {
			response.setResponseMessage("Employee not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		// Validate department
		Department department = this.departmentDao.findById(departmentId).orElse(null);
		if (department == null) {
			response.setResponseMessage("Department not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		// Validate designation
		Designation designation = this.designationDao.findById(designationId).orElse(null);
		if (designation == null) {
			response.setResponseMessage("Designation not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		// Validate that the designation belongs to the department
		if (designation.getDepartment().getId() == department.getId()) {
			response.setResponseMessage(
					"Invalid designation!!! The selected designation does not belong to the selected department.");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		User reportingManager = this.userDao.findById(reportingManagerId).orElse(null);

		if (reportingManager == null) {
			response.setResponseMessage("Reporting Manager not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (!reportingManager.getEmployee().getDesignation().getName()
				.equals(com.hrms.utility.Constants.Designation.PROJECT_MANAGER.value())) {
			response.setResponseMessage("Reporting Manager not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (reportingManager.getEmployee().getDepartment().getId() != departmentId) {
			response.setResponseMessage("Provided Reporting Manager is not matching with Department!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		// Update employee's department and designation
		employee.setDepartment(department);
		employee.setDesignation(designation);
		employee.setReportingManager(reportingManager);

		Employee updatedEmployee = this.employeeDao.save(employee);
		if (updatedEmployee == null) {
			response.setResponseMessage("Failed to update the Employee's Department and Designation...");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Employee's Department and Designation updated successfully!!!");
		response.setSuccess(true);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateEmploymentStatus(int userId, String status, String dateOfExit) {

		LOG.info("Received request to update employment status for userId: {}, status: {}, dateOfExit: {}", userId,
				status, dateOfExit);

		CommonApiResponse response = new CommonApiResponse();

		// Validate User
		User user = userDao.findById(userId).orElse(null);
		if (user == null) {
			response.setResponseMessage("User not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		// Validate Employee
		Employee employee = user.getEmployee();
		if (employee == null) {
			response.setResponseMessage("Employee record not found for the provided User!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		// Validate status
		if (!status.equalsIgnoreCase(EmployeementStatus.RESIGNED.value())
				&& !status.equalsIgnoreCase(EmployeementStatus.TERMINATED.value())) {
			response.setResponseMessage("Invalid status!!! Status must be 'Resigned' or 'Terminated'.");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		// Update Employee details
		employee.setEmploymentStatus(status);
		employee.setDateOfExit(dateOfExit);

		// Update User status
		user.setStatus(ActiveStatus.DEACTIVATED.value());

		// Save updates
		employeeDao.save(employee);
		userDao.save(user);

		response.setResponseMessage("Employee status and User status updated successfully!!!");
		response.setSuccess(true);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public void fetchEmployeeProfilePic(String employeeProfilePic, HttpServletResponse resp) {
		LOG.info("Received request to fetch employee profile pic!!!");
		Resource resource = storageService.load(employeeProfilePic);
		if (resource != null) {
			try (InputStream in = resource.getInputStream()) {
				ServletOutputStream out = resp.getOutputStream();
				FileCopyUtils.copy(in, out);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		LOG.info("Response sent!!!");
	}
	
	public ResponseEntity<Resource> downloadDocumemt(String documentFileName, HttpServletResponse response) {

		Resource resource = storageService.load(documentFileName);
		if (resource == null) {
			// Handle file not found
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Document\"")
				.body(resource);

	}

}
