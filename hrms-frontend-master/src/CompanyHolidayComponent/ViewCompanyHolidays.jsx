import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import BASE_URL from "../config";
import { ToastContainer, toast } from "react-toastify";

const ViewCompanyHolidays = () => {
  const hr = JSON.parse(sessionStorage.getItem("active-hr"));
  const hr_jwtToken = sessionStorage.getItem("hr-jwtToken");

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
      `${BASE_URL}/api/holiday/company/${hr.company.id}`
    );
    console.log(response.data);
    return response.data;
  };

  const deleteHoliday = (holidayId, e) => {
    fetch(`${BASE_URL}/api/holiday/delete/${holidayId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //   Authorization: "Bearer " + admin_jwtToken,
      },
    })
      .then((result) => {
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
              window.location.reload(true);
            }, 1000); // Redirect after 3 seconds
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
            setTimeout(() => {
              window.location.reload(true);
            }, 1000); // Redirect after 3 seconds
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
        setTimeout(() => {
          window.location.reload(true);
        }, 1000); // Redirect after 3 seconds
      });
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
                  <th scope="col">Action</th>
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

                      <td>
                        <button
                          onClick={() => deleteHoliday(holiday.id)}
                          className="btn btn-sm bg-color custom-bg-text ms-2 "
                        >
                          Delete
                        </button>
                        <ToastContainer />
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

export default ViewCompanyHolidays;
