import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import { ToastContainer, toast } from "react-toastify";

const ViewEmployeePayslip = () => {
  const { employeeId } = useParams();
  const [payslips, setPayslips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllPayslip = async () => {
      try {
        const res = await retrieveAllPayslip();
        if (res) {
          setPayslips(res.payslips);
        }
      } catch (error) {
        toast.error("Error fetching payslips");
        console.error("Error fetching payslips:", error);
      }
    };

    getAllPayslip();
  }, [employeeId]);

  const retrieveAllPayslip = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/payslip/fetch/employee-wise?employeeId=${employeeId}`
    );
    return response.data;
  };

  const downloadPayslip = async (payslipId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/payslip/download?payslipId=${payslipId}`,
        {
          responseType: "blob", // Ensures the file is received as a blob
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payslip_${payslipId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      toast.success("Payslip downloaded successfully");
    } catch (error) {
      toast.error("Error downloading payslip");
      console.error("Error downloading payslip:", error);
    }
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 shadow-lg"
        style={{ height: "45rem" }}
      >
        <div
          className="card-header custom-bg-text text-center bg-color"
          style={{ borderRadius: "1em", height: "50px" }}
        >
          <h2>Employee Monthly Payslips</h2>
        </div>
        <div className="card-body" style={{ overflowY: "auto" }}>
          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col">Days Absent</th>
                  <th scope="col">Gross Salary</th>
                  <th scope="col">Total Deductions</th>
                  <th scope="col">Net Salary</th>
                  <th scope="col">Bank Account Number</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {payslips.map((payslip) => (
                  <tr key={payslip.id}>
                    <td>
                      <b>{payslip.month + " " + payslip.year}</b>
                    </td>
                    <td>
                      <b>{payslip.daysAbsent}</b>
                    </td>
                    <td>
                      <b>{payslip.grossSalary}</b>
                    </td>
                    <td>
                      <b>{payslip.totalDeductions}</b>
                    </td>
                    <td>
                      <b>{payslip.netSalary}</b>
                    </td>
                    <td>
                      <b>{payslip.bankAccountNumber}</b>
                    </td>
                    <td>
                      <button
                        onClick={() => downloadPayslip(payslip.id)}
                        className="btn bg-color custom-bg-text btn-sm"
                      >
                        Download Payslip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ViewEmployeePayslip;
