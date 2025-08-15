import { useState, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import BASE_URL from "../config";

const AddEmployeeDetail = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const employeeUser = location.state;

  const company_jwtToken = sessionStorage.getItem("company-jwtToken");

  const company = JSON.parse(sessionStorage.getItem("active-company"));
  const hr = JSON.parse(sessionStorage.getItem("active-hr"));
  const hr_jwtToken = sessionStorage.getItem("hr-jwtToken");

  //const [departmentId, setDepartmentId] = useState(0);

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [employeeDetail, setEmployeeDetail] = useState({
    // Personal Information
    firstName: employeeUser.firstName,
    lastName: employeeUser.lastName,
    emailId: employeeUser.emailId,
    phoneNo: employeeUser.phoneNo,
    gender: "",
    dateOfBirth: "",
    maritalStatus: "",
    bloodGroup: "",
    // Address Information
    permanentAddress: "",
    currentAddress: "",
    city: "",
    state: "",
    postalCode: "",
    // Employment Details
    employeeCode: "",
    employmentType: "",
    dateOfJoining: "",
    dateOfExit: "",
    workLocation: "",
    
    // Salary and Payroll Information
    ctc: "",
    basicSalary: "",
    hra: "",
    lta: "",
    conveyanceAllowance: "",
    retentionAllowance: "",
    mobileAllowance: "",
    providentFund: "",
    professionTax: "",
    tds: "",
    // Adjustments for Extra Days
    extraDayPayBase: "",
    extraDayPayHra: "",
    extraDayPayConveyanceAllowance: "",
    extraDayPayRetentionAllowance: "",
    extraDayPayPf: "",
    extraDayPayTds: "",
    // Deductions for Absent Days
    absentDayPayBase: "",
    absentDayPayHra: "",
    absentDayPayConveyanceAllowance: "",
    absentDayPayRetentionAllowance: "",
    absentDayPayPf: "",
    absentDayPayTds: "",
    // provident fund account detail
    pfNo: "",
    uan: "",
    // Bank Details
    bankName: "",
    bankAccountNumber: "",
    ifscCode: "",
    panNumber: "",
    aadhaarNumber: "",
    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    hrId: hr.id,
    // reportingManagerId: "",
    designationId: "", // from Drop down -> after Department
    departmentId: 0, // from Drop down -> first Select Department then we will get designations under it
    employeeUserId: employeeUser.id,
    reportingManagerId: 0, // if designation is not Project Manager
  });

  useEffect(() => {
    const getAllDepartment = async () => {
      const departments = await retrieveAllDepartment();
      if (departments) {
        setDepartments(departments.departments);
      }
    };

    if (employeeDetail.departmentId !== 0) {
      const getAllDepartmentDesignations = async () => {
        const designations = await retrieveDepartmentDesignations(
          employeeDetail.departmentId
        );
        if (designations) {
          setDesignations(designations.designations);
        }
      };
      getAllDepartmentDesignations();
    }

    getAllDepartment();
  }, [employeeDetail.departmentId]);

  const retrieveAllDepartment = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/department/fetch/company-wise?companyId=${hr.company.id}`
    );
    console.log(response.data);
    return response.data;
  };

  const retrieveDepartmentDesignations = async (departmentId) => {
    const response = await axios.get(
      `${BASE_URL}/api/designation/fetch/company-department-wise?companyId=${hr.company.id}&departmentId=${departmentId}`
    );
    console.log(response.data);
    return response.data;
  };

  const handleUserInput = (e) => {
    setEmployeeDetail({ ...employeeDetail, [e.target.name]: e.target.value });
  };

  const saveEmployeeDetail = (e) => {
    e.preventDefault();

    let jwtToken;

    fetch(`${BASE_URL}/api/employee/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //    Authorization: "Bearer " + jwtToken,
      },
      body: JSON.stringify(employeeDetail),
    })
      .then((result) => {
        console.log("result", result);
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            setTimeout(() => {
              navigate("/hr/company/employee/view");
            }, 1000);
          } else if (!res.success) {
            toast.error(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            // setTimeout(() => {
            //   window.location.reload(true);
            // }, 1000); // Redirect after 3 seconds
          } else {
            toast.error("It seems server is down", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            // setTimeout(() => {
            //   window.location.reload(true);
            // }, 1000); // Redirect after 3 seconds
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // setTimeout(() => {
        //   window.location.reload(true);
        // }, 1000); // Redirect after 3 seconds
      });
  };

  return (
    <div>
      <div className="mt-2 ms-5 me-5 mb-5 d-flex aligns-items-center justify-content-center ms-2 me-2 mb-2">
        <div className="form-card border-color text-color">
          <div className="container-fluid">
            <div
              className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center"
              style={{
                borderRadius: "1em",
                height: "45px",
              }}
            >
              <h5 className="card-title">Add Employee Detail!!!</h5>
            </div>
            <div className="card-body mt-3">
              <form className="row g-3" onSubmit={saveEmployeeDetail}>
                <h4 className="text-left"> Personal Detail</h4>
                <div className="col-md-4 mb-3">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={employeeDetail.firstName}
                    onChange={handleUserInput}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={employeeDetail.lastName}
                    onChange={handleUserInput}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="emailId"
                    value={employeeDetail.emailId}
                    onChange={handleUserInput}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phoneNo"
                    value={employeeDetail.phoneNo}
                    onChange={handleUserInput}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Gender</label>
                  <select
                    className="form-control"
                    name="gender"
                    value={employeeDetail.gender}
                    onChange={handleUserInput}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dateOfBirth"
                    value={employeeDetail.dateOfBirth}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Marital Status</label>
                  <select
                    className="form-control"
                    name="maritalStatus"
                    value={employeeDetail.maritalStatus}
                    onChange={handleUserInput}
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label>Blood Group</label>
                  <select
                    className="form-select"
                    name="bloodGroup"
                    value={employeeDetail.bloodGroup}
                    onChange={handleUserInput}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                {/* Address */}
                <h4 className="text-left"> Address Detail</h4>
                <div className="col-md-4 mb-3">
                  <label>Permanent Address</label>
                  <textarea
                    className="form-control"
                    name="permanentAddress"
                    value={employeeDetail.permanentAddress}
                    onChange={handleUserInput}
                  ></textarea>
                </div>
                <div className="col-md-4 mb-3">
                  <label>Current Address</label>
                  <textarea
                    className="form-control"
                    name="currentAddress"
                    value={employeeDetail.currentAddress}
                    onChange={handleUserInput}
                  ></textarea>
                </div>
                <div className="col-md-4 mb-3">
                  <label>City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={employeeDetail.city}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>State</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={employeeDetail.state}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="postalCode"
                    value={employeeDetail.postalCode}
                    onChange={handleUserInput}
                  />
                </div>

                {/* Employment Details */}
                <h4 className="text-left"> Employment Detail</h4>
                <div className="col-md-4 mb-3">
                  <label>Employee Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="employeeCode"
                    value={employeeDetail.employeeCode}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Employment Type</label>
                  <select
                    className="form-control"
                    name="employmentType"
                    value={employeeDetail.employmentType}
                    onChange={handleUserInput}
                  >
                    <option value="">Select Employment Type</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label>Date of Joining</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dateOfJoining"
                    value={employeeDetail.dateOfJoining}
                    onChange={handleUserInput}
                  />
                </div>
                {/* Designation and Department */}
                <div className="col-md-4 mb-3 text-color">
                  <label htmlFor="departmentId" className="form-label">
                    Department
                  </label>
                  <select
                    className="form-select"
                    id="departmentId"
                    name="departmentId"
                    value={employeeDetail.departmentId}
                    onChange={handleUserInput}
                  >
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-3 text-color">
                  <label htmlFor="designationId" className="form-label">
                    Designation
                  </label>
                  <select
                    className="form-select"
                    id="designationId"
                    name="designationId"
                    value={employeeDetail.designationId}
                    onChange={handleUserInput}
                  >
                    <option value="">Select Designation</option>
                    {designations.map((designation) => (
                      <option key={designation.id} value={designation.id}>
                        {designation.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label>Work Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="workLocation"
                    value={employeeDetail.workLocation}
                    onChange={handleUserInput}
                  />
                </div>

                {/* PF detail */}
                <h4 className="text-left"> PF Detail</h4>
                <div className="col-md-4 mb-3">
                  <label>PF No.</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pfNo"
                    value={employeeDetail.pfNo}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>UAN</label>
                  <input
                    type="text"
                    className="form-control"
                    name="uan"
                    value={employeeDetail.uan}
                    onChange={handleUserInput}
                  />
                </div>
                {/* PF Detail */}
                {/* Bank Details */}
                <h4 className="text-left"> Bank Detail</h4>
                <div className="col-md-4 mb-3">
                  <label>Bank Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bankName"
                    value={employeeDetail.bankName}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Bank Account Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bankAccountNumber"
                    value={employeeDetail.bankAccountNumber}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>IFSC Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ifscCode"
                    value={employeeDetail.ifscCode}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>PAN Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="panNumber"
                    value={employeeDetail.panNumber}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Aadhaar Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="aadhaarNumber"
                    value={employeeDetail.aadhaarNumber}
                    onChange={handleUserInput}
                  />
                </div>

                <h4 className="text-left"> Emergency Detail</h4>

                {/* Emergency Contact */}
                <div className="col-md-4 mb-3 text-color">
                  <label htmlFor="emergencyContactName" className="form-label">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={employeeDetail.emergencyContactName}
                    onChange={handleUserInput}
                  />
                </div>

                <div className="col-md-4 mb-3 text-color">
                  <label htmlFor="emergencyContactPhone" className="form-label">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    value={employeeDetail.emergencyContactPhone}
                    onChange={handleUserInput}
                  />
                </div>

                <div className="col-md-4 mb-3 text-color">
                  <label
                    htmlFor="emergencyContactRelation"
                    className="form-label"
                  >
                    Emergency Contact Relation
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="emergencyContactRelation"
                    name="emergencyContactRelation"
                    value={employeeDetail.emergencyContactRelation}
                    onChange={handleUserInput}
                  />
                </div>

                {/* Salary and Payroll Information */}
                <h4 className="text-left"> Salary Detail</h4>
                <div className="col-md-4 mb-3">
                  <label>CTC</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ctc"
                    value={employeeDetail.ctc}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Basic Salary</label>
                  <input
                    type="text"
                    className="form-control"
                    name="basicSalary"
                    value={employeeDetail.basicSalary}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>HRA</label>
                  <input
                    type="text"
                    className="form-control"
                    name="hra"
                    value={employeeDetail.hra}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>LTA</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lta"
                    value={employeeDetail.lta}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Conveyance Allowance</label>
                  <input
                    type="text"
                    className="form-control"
                    name="conveyanceAllowance"
                    value={employeeDetail.conveyanceAllowance}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Retention Allowance</label>
                  <input
                    type="text"
                    className="form-control"
                    name="retentionAllowance"
                    value={employeeDetail.retentionAllowance}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Mobile Allowance</label>
                  <input
                    type="text"
                    className="form-control"
                    name="mobileAllowance"
                    value={employeeDetail.mobileAllowance}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Provident Fund</label>
                  <input
                    type="text"
                    className="form-control"
                    name="providentFund"
                    value={employeeDetail.providentFund}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Profession Tax</label>
                  <input
                    type="text"
                    className="form-control"
                    name="professionTax"
                    value={employeeDetail.professionTax}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>TDS</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tds"
                    value={employeeDetail.tds}
                    onChange={handleUserInput}
                  />
                </div>
                <h4 className="text-left"> Extra Day Pay Detail</h4>
                <div className="col-md-4 mb-3">
                  <label>Extra Day Pay (Base)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="extraDayPayBase"
                    value={employeeDetail.extraDayPayBase}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Extra Day Pay (HRA)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="extraDayPayHra"
                    value={employeeDetail.extraDayPayHra}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Extra Day Pay (Conveyance Allowance)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="extraDayPayConveyanceAllowance"
                    value={employeeDetail.extraDayPayConveyanceAllowance}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Extra Day Pay (Retention Allowance)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="extraDayPayRetentionAllowance"
                    value={employeeDetail.extraDayPayRetentionAllowance}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Extra Day Pay (PF)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="extraDayPayPf"
                    value={employeeDetail.extraDayPayPf}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Extra Day Pay (TDS)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="extraDayPayTds"
                    value={employeeDetail.extraDayPayTds}
                    onChange={handleUserInput}
                  />
                </div>
                <h4 className="text-left"> Absent Day Deduction Detail</h4>
                <div className="col-md-4 mb-3">
                  <label>Absent Day Pay (Base)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="absentDayPayBase"
                    value={employeeDetail.absentDayPayBase}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Absent Day Pay (HRA)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="absentDayPayHra"
                    value={employeeDetail.absentDayPayHra}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Absent Day Pay (Conveyance Allowance)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="absentDayPayConveyanceAllowance"
                    value={employeeDetail.absentDayPayConveyanceAllowance}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Absent Day Pay (Retention Allowance)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="absentDayPayRetentionAllowance"
                    value={employeeDetail.absentDayPayRetentionAllowance}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Absent Day Pay (PF)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="absentDayPayPf"
                    value={employeeDetail.absentDayPayPf}
                    onChange={handleUserInput}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Absent Day Pay (TDS)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="absentDayPayTds"
                    value={employeeDetail.absentDayPayTds}
                    onChange={handleUserInput}
                  />
                </div>

                <div className="d-flex aligns-items-center justify-content-center">
                  <input
                    type="submit"
                    className="btn bg-color custom-bg-text"
                    value="Add Detail"
                  />
                </div>
                <ToastContainer />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeDetail;
