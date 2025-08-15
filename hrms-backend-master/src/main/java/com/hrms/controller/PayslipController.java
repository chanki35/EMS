package com.hrms.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hrms.dao.PayslipDao;
import com.hrms.dto.PaySlipResponseDto;
import com.hrms.entity.Payslip;
import com.hrms.service.PaySlipService;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("api/payslip")
@CrossOrigin(origins = "http://localhost:3000")
public class PayslipController {

	@Autowired
	private PaySlipService paySlipService;

	@Autowired
	private PayslipDao payslipDao;

	@GetMapping("/fetch/employee-wise")
	@Operation(summary = "Api to fetch the employee payslip")
	public ResponseEntity<PaySlipResponseDto> fetchEmployeePayslip(@RequestParam("employeeId") int employeeId) {
		return paySlipService.fetchEmployeePayslip(employeeId);
	}

	@GetMapping("/download")
	public ResponseEntity<byte[]> downloadPayslip(@RequestParam("payslipId") int payslipId) {
		Optional<Payslip> payslipOpt = payslipDao.findById(payslipId);

		if (!payslipOpt.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}

		Payslip payslip = payslipOpt.get();

		try {
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			PdfDocument pdfDoc = new PdfDocument(new PdfWriter(out));
			Document document = new Document(pdfDoc, PageSize.A4);

			document.add(new Paragraph("Payslip").setBold().setFontSize(20).setFontColor(ColorConstants.BLUE));
			document.add(new Paragraph("Company Name: "+payslip.getEmployee().getDepartment().getCompany().getName()));
			document.add(new Paragraph("Month: " + payslip.getMonth() + " " + payslip.getYear()).setBold());
			document.add(new Paragraph("\n"));

			// Employee Details Table
			Table empTable = new Table(2);
			empTable.addCell(createCell("Employee Name:"));
			empTable.addCell(createCell(payslip.getFullName()));
			empTable.addCell(createCell("Employee Code:"));
			empTable.addCell(createCell(payslip.getEmployeeCode()));
			empTable.addCell(createCell("Designation:"));
			empTable.addCell(createCell(payslip.getDesignationName()));
			empTable.addCell(createCell("Department:"));
			empTable.addCell(createCell(payslip.getDepartmentName()));

			document.add(empTable);
			document.add(new Paragraph("\n"));

			// Salary Breakdown Table
			Table salaryTable = new Table(2);
			salaryTable.addCell(createHeaderCell("Salary Component"));
			salaryTable.addCell(createHeaderCell("Amount (INR)"));

			salaryTable.addCell(createCell("Basic Salary"));
			salaryTable.addCell(createCell(payslip.getBasicSalary()));

			salaryTable.addCell(createCell("House Rent Allowance (HRA)"));
			salaryTable.addCell(createCell(payslip.getHra()));

			salaryTable.addCell(createCell("Conveyance Allowance"));
			salaryTable.addCell(createCell(payslip.getConveyanceAllowance()));

			salaryTable.addCell(createCell("Retention Allowance"));
			salaryTable.addCell(createCell(payslip.getRetentionAllowance()));

			salaryTable.addCell(createHeaderCell("Total Earnings"));
			salaryTable.addCell(createHeaderCell(String.valueOf(payslip.getGrossSalary())));

			salaryTable.addCell(createCell("Provident Fund (PF)"));
			salaryTable.addCell(createCell(payslip.getProvidentFund()));

			salaryTable.addCell(createCell("Professional Tax"));
			salaryTable.addCell(createCell(payslip.getProfessionTax()));

			salaryTable.addCell(createCell("TDS"));
			salaryTable.addCell(createCell(payslip.getTds()));

			salaryTable.addCell(createHeaderCell("Total Deductions"));
			salaryTable.addCell(createHeaderCell(String.valueOf(payslip.getTotalDeductions())));

			salaryTable.addCell(createHeaderCell("Net Salary"));
			salaryTable.addCell(createHeaderCell(String.valueOf(payslip.getNetSalary())));

			document.add(salaryTable);
			document.close();

			// Set response headers for download
			HttpHeaders headers = new HttpHeaders();
			headers.add("Content-Disposition", "attachment; filename=payslip_" + payslip.getId() + ".pdf");

			return ResponseEntity.ok().headers(headers).contentType(org.springframework.http.MediaType.APPLICATION_PDF)
					.body(out.toByteArray());

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	private Cell createCell(String text) {
		return new Cell().add(new Paragraph(text)).setBorder(Border.NO_BORDER);
	}

	private Cell createCell(BigDecimal value) {
		return new Cell().add(new Paragraph(value != null ? value.toString() : "-")).setBorder(Border.NO_BORDER);
	}

	private Cell createHeaderCell(String text) {
		return new Cell().add(new Paragraph(text).setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY);
	}
}
