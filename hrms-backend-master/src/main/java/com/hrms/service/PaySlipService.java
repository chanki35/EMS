package com.hrms.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.hrms.dao.EmployeeDao;
import com.hrms.dao.PayslipDao;
import com.hrms.dto.PaySlipResponseDto;
import com.hrms.entity.Employee;
import com.hrms.entity.Payslip;


@Service
public class PaySlipService {

	@Autowired
	private PayslipDao payslipDao;

	@Autowired
	private EmployeeDao employeeDao;

	public ResponseEntity<PaySlipResponseDto> fetchEmployeePayslip(int employeeId) {

		PaySlipResponseDto response = new PaySlipResponseDto();

		if (employeeId == 0) {
			response.setResponseMessage("missing input");
			response.setSuccess(false);
			return new ResponseEntity<PaySlipResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		Employee employee = this.employeeDao.findById(employeeId).orElse(null);

		if (employee == null) {
			response.setResponseMessage("employee detail not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<PaySlipResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<Payslip> payslips = this.payslipDao.findByEmployee(employee);

		if (CollectionUtils.isEmpty(payslips)) {
			response.setResponseMessage("Payslips not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<PaySlipResponseDto>(response, HttpStatus.OK);
		}

		response.setPayslips(payslips);
		response.setResponseMessage("Payslip Fetched Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<PaySlipResponseDto>(response, HttpStatus.OK);

	}

}
