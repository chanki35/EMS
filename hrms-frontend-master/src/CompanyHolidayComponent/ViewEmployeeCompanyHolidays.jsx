import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import BASE_URL from "../config";
import { ToastContainer, toast } from "react-toastify";

const ViewEmployeeCompanyHolidays = () => {
  const employee = JSON.parse(sessionStorage.getItem("active-employee"));
  const employee_jwtToken = sessionStorage.getItem("employee-jwtToken");

  const [holidays, setHolidays] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    const getAllHoliday = async () => {
      const res = await retrieveAllHoliday();
      if (res) {
        setHolidays(res.holidays);
      }
    };

    getAllHoliday();
  }, []);

  const retrieveAllHoliday = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/holiday/company/${employee.company.id}`
    );
    console.log(response.data);
    return response.data;
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
          <h2>Company Holidays</h2>
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
                  <th scope="col">Holiday Date</th>
                  <th scope="col">Holiday Name</th>
                  <th scope="col">Holiday Description</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((holiday) => {
                  return (
                    <tr>
                      <td>
                        <b>{holiday.date}</b>
                      </td>
                      <td>
                        <b>{holiday.name}</b>
                      </td>
                      <td>
                        <b>{holiday.description}</b>
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

export default ViewEmployeeCompanyHolidays;
