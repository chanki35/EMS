import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import BASE_URL from "../config";
import { ToastContainer, toast } from "react-toastify";

const EmployeeLeaveManagement = () => {
  const employee = JSON.parse(sessionStorage.getItem("active-employee"));
  const employee_jwtToken = sessionStorage.getItem("employee-jwtToken");

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [designationId, setDesignationId] = useState(0); // for fetching the employees

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [comment, setComment] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    const getAllLeaveRequests = async () => {
      const res = await retrieveAllLeaveRequests();
      if (res) {
        setLeaveRequests(res.requests);
      }
    };

    getAllLeaveRequests();
  }, []);

  const retrieveAllLeaveRequests = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/leave/request/employee/${employee.id}`
    );
    console.log(response.data);
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    return date.toLocaleString(); // Format the epoch time as a human-readable date
  };

  const approveRequest = (leaveId, e) => {
    fetch(
      `${BASE_URL}/api/leave/request/approve/${leaveId}?comment=${comment}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //   Authorization: "Bearer " + admin_jwtToken,
        },
      }
    )
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

  const rejectRequest = (leaveId, e) => {
    fetch(
      `${BASE_URL}/api/leave/request/approve/${leaveId}?comment=${comment}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //   Authorization: "Bearer " + admin_jwtToken,
        },
      }
    )
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
          <h2>Leave Requests</h2>
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
                  <th scope="col">Leave Id</th>
                  <th scope="col">Request Date</th>
                  <th scope="col">Reason</th>
                  <th scope="col">Manager's Comment</th>
                  <th scope="col">Request Time</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((leaveRequest) => {
                  return (
                    <tr>
                      <td>
                        <b>{leaveRequest.id}</b>
                      </td>
                      <td>
                        <b>{leaveRequest.date}</b>
                      </td>
                      <td>
                        <b>{leaveRequest.reason}</b>
                      </td>
                      <td>
                        <b>{leaveRequest.managerComments}</b>
                      </td>
                      <td>
                        <b>{formatDateFromEpoch(leaveRequest.createdDate)}</b>
                      </td>

                      <td>
                        <b>{leaveRequest.status}</b>
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

export default EmployeeLeaveManagement;
