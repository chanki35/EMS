import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import BASE_URL from "../config";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ViewProjectManagerEmployees = () => {
  const [allEmployee, setAllEmployee] = useState([]);
  const employee_jwtToken = sessionStorage.getItem("employee-jwtToken");
  const employee = JSON.parse(sessionStorage.getItem("active-employee"));
  let navigate = useNavigate();
  useEffect(() => {
    const getAllUsers = async () => {
      const allUsers = await retrieveAllUser();
      if (allUsers) {
        setAllEmployee(allUsers.users);
      }
    };

    getAllUsers();
  }, []);

  const retrieveAllUser = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/user/fetch/manager-wise/employee/?userManagerId=${employee.id}`,
      {
        headers: {
          //   Authorization: "Bearer " + employee_jwtToken, // Replace with your actual JWT token
        },
      }
    );
    console.log(response.data);
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  const addEmployeeDetailPage = (employeeUser) => {
    navigate("/employee/detail/add", { state: employeeUser });
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 shadow-lg"
        style={{
          height: "45rem",
        }}
      >
        <div
          className="card-header custom-bg-text text-center bg-color"
          style={{
            borderRadius: "1em",
            height: "50px",
          }}
        >
          <h2> Employees</h2>
        </div>
        <div
          className="card-body"
          style={{
            overflowY: "auto",
          }}
        >
          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Email Id</th>
                  <th scope="col">Phone No</th>
                  <th scope="col">Department</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {allEmployee.map((employeeUser) => {
                  return (
                    <tr>
                      <td>
                        <b>{employeeUser.firstName}</b>
                      </td>
                      <td>
                        <b>{employeeUser.lastName}</b>
                      </td>
                      <td>
                        <b>{employeeUser.emailId}</b>
                      </td>
                      <td>
                        <b>{employeeUser.phoneNo}</b>
                      </td>
                      <td>
                        {(() => {
                          if (
                            employeeUser.employee !== null &&
                            Object.keys(employeeUser.employee).length > 0
                          ) {
                            return (
                              <b>
                                {employeeUser.employee.department.name +
                                  " [" +
                                  employeeUser.employee.designation.name +
                                  "]"}{" "}
                              </b>
                            );
                          } else {
                            return <b>-</b>;
                          }
                        })()}
                      </td>
                      <td>
                        <b>{employeeUser.status}</b>
                      </td>
                      <td>
                        {(() => {
                          if (employeeUser.employee !== null) {
                            return (
                              <>
                                <Link
                                  to={`/employee/view?employeeUserId=${employeeUser.id}`}
                                  className="btn btn-sm bg-color custom-bg-text"
                                >
                                  Details
                                </Link>
                                <Link
                                  to={`/employee/${employeeUser.id}/attendance/manager/view`}
                                  className="btn btn-sm bg-color custom-bg-text ms-2"
                                >
                                  Attendance
                                </Link>
                              </>
                            );
                          }
                        })()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectManagerEmployees;
