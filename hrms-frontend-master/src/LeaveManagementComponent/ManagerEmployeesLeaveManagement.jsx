import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import BASE_URL from "../config";
import { ToastContainer, toast } from "react-toastify";

const ManagerEmployeesLeaveManagement = () => {
  const employee = JSON.parse(sessionStorage.getItem("active-employee"));
  const employee_jwtToken = sessionStorage.getItem("employee-jwtToken");

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [leaveId, setLeaveId] = useState(0);
  const [comment, setComment] = useState("");

  const showLeaveRequestActionModal = (leaveId) => {
    setLeaveId(leaveId);
    handleShow();
  };

  const [leaveRequests, setLeaveRequests] = useState([]);

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
      `${BASE_URL}/api/leave/request/manager/${employee.id}`
    );
    console.log(response.data);
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    return date.toLocaleString(); // Format the epoch time as a human-readable date
  };

  const approveRequest = (e) => {
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

  const rejectRequest = (e) => {
    fetch(
      `${BASE_URL}/api/leave/request/reject/${leaveId}?comment=${comment}`,
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
                  <th scope="col">Employee Name</th>
                  <th scope="col">Employee Email</th>
                  <th scope="col">Request Date</th>
                  <th scope="col">Reason</th>
                  <th scope="col">Manager's Comment</th>
                  <th scope="col">Request Time</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
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
                        <b>
                          {leaveRequest.employee.firstName +
                            " " +
                            leaveRequest.employee.lastName}
                        </b>
                      </td>
                      <td>
                        <b>{leaveRequest.employee.emailId}</b>
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
                      <td>
                        {leaveRequest?.status === "Pending" && (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() =>
                              showLeaveRequestActionModal(leaveRequest.id)
                            }
                          >
                            Action
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} size="md">
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title
            style={{
              borderRadius: "1em",
            }}
          >
            Employee Leave Request Action Form!!!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mt-3">
            <div className="container-fluid">
              <div
                className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center"
                style={{
                  borderRadius: "1em",
                  height: "38px",
                }}
              >
                <h5 class="card-title">Leave Request Action</h5>
              </div>
              <div class="card-body text-color mt-3">
                <form>
                  <div class="mb-3">
                    <label for="description" class="form-label">
                      <b>Comment</b>
                    </label>
                    <textarea
                      class="form-control"
                      id="comment"
                      rows="3"
                      placeholder="add comment here.."
                      onChange={(e) => setComment(e.target.value)}
                      value={comment}
                    />
                  </div>

                  <div className="d-flex aligns-items-center justify-content-center mb-2">
                    <button
                      type="submit"
                      onClick={approveRequest}
                      class="btn btn-success btn-sm"
                    >
                      Approve
                    </button>
                    <ToastContainer />
                    <button
                      type="submit"
                      onClick={rejectRequest}
                      class="btn btn-danger btn-sm ms-3"
                    >
                      Reject
                    </button>
                    <ToastContainer />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManagerEmployeesLeaveManagement;
