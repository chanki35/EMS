import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import BASE_URL from "../config";
import { ToastContainer, toast } from "react-toastify";

const EmployeeAttendanceManagerView = () => {
  const { employeeId } = useParams();

  const hr = JSON.parse(sessionStorage.getItem("active-hr"));
  const employee = JSON.parse(sessionStorage.getItem("active-employee"));
  const employee_jwtToken = sessionStorage.getItem("employee-jwtToken");

  const [regularizeDate, setRegularizeDate] = useState("");

  const [regularizeRequest, setRegularizeRequest] = useState({
    clockInTime: "",
    clockOutTime: "",
    reason: "",
  });

  const handleUserInput = (e) => {
    setRegularizeRequest({
      ...regularizeRequest,
      [e.target.name]: e.target.value,
    });
  };

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const showRegularizeAttendanceForm = (attendanceDate) => {
    setRegularizeDate(attendanceDate);
    handleShow();
  };

  const [attendances, setAttendances] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    const getEmployeeCurrentMonthAttendanceEntries = async () => {
      const res = await retrieveEmployeeCurrentMonthAttendanceEntries();
      if (res) {
        setAttendances(res.attendances);
      }
    };

    getEmployeeCurrentMonthAttendanceEntries();
  }, []);

  const retrieveEmployeeCurrentMonthAttendanceEntries = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/attendance/fetch/employee/current-month?userId=${employeeId}`
    );
    console.log(response.data);
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    return date.toLocaleString(); // Format the epoch time as a human-readable date
  };

  const convertToMillis = (datetimeValue) => {
    return datetimeValue ? new Date(datetimeValue).getTime() : null;
  };

  const regularizeAttendance = (e) => {
    e.preventDefault();

    // Construct a properly formatted query string
    const data = {
      updatedByUserId: employee ? employee.id : hr.id,
      userId: employeeId,
      date: regularizeDate,
      clockInTime: convertToMillis(regularizeRequest.clockInTime),
      clockOutTime: convertToMillis(regularizeRequest.clockOutTime),
      reason: regularizeRequest.reason,
    };

    fetch(`${BASE_URL}/api/attendance/employee/regularize`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //    Authorization: "Bearer " + employee_jwtToken,
      },
      body: JSON.stringify(data),
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
              window.location.reload(true);
            }, 2000); // Redirect after 3 seconds
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
          <h2>Employee Month Attendance</h2>
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
                  <th scope="col">Date</th>
                  <th scope="col">Clock In</th>
                  <th scope="col">Clock Out</th>
                  <th scope="col">Total Hours Worked</th>
                  <th scope="col">Working Status</th>
                  <th scope="col">Attendance Status</th>
                  <th scope="col">Leave Reason</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((attendance, index) => {
                  const attendanceDate = new Date(attendance.date); // Convert date string to Date object
                  const today = new Date();
                  today.setHours(0, 0, 0, 0); // Reset today's time to compare only date

                  return (
                    <tr key={index}>
                      <td>
                        <b>{attendance.date}</b>
                      </td>
                      <td>
                        <b>
                          {attendance.clockIn ? (
                            formatDateFromEpoch(attendance.clockIn)
                          ) : attendance.workingStatus === "Working" &&
                            attendanceDate < today ? (
                            <span style={{ color: "red" }}>Not Punch</span>
                          ) : (
                            "NA"
                          )}
                        </b>
                      </td>

                      <td>
                        <b>
                          {attendance.clockOut ? (
                            formatDateFromEpoch(attendance.clockOut)
                          ) : attendance.workingStatus === "Working" &&
                            attendanceDate < today ? (
                            <span style={{ color: "red" }}>Not Punch</span>
                          ) : (
                            "NA"
                          )}
                        </b>
                      </td>

                      <td>
                        <b>{attendance.totalHoursWorked}</b>
                      </td>
                      <td>
                        <b
                          style={{
                            color:
                              attendance.workingStatus === "Holiday"
                                ? "red"
                                : "inherit",
                          }}
                        >
                          {attendance.workingStatus || ""}
                        </b>
                      </td>

                      <td>
                        <b
                          style={{
                            color:
                              attendance.status === "Loss of Pay" ||
                              attendance.status === "Half Loss of Pay"
                                ? "red"
                                : "inherit",
                          }}
                        >
                          {attendance.status || ""}
                        </b>
                      </td>

                      <td>
                        <b>{attendance.reason || "---"}</b>
                      </td>
                      <td>
                        {(employee || hr) &&
                          attendance.workingStatus === "Working" &&
                          attendance.status !== "Present" &&
                          attendanceDate < today && (
                            <button
                              onClick={() =>
                                showRegularizeAttendanceForm(attendance.date)
                              }
                              className="btn btn-sm bg-color custom-bg-text ms-2"
                            >
                              Regularize
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
            Regularize Attendance Form!!!
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
                <h5 class="card-title">Regularize Request</h5>
              </div>
              <div class="card-body text-color mt-3">
                <form>
                  <div class="mb-3">
                    <label for="title" class="form-label">
                      <b>Clock In Time</b>
                    </label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="title"
                      name="clockInTime"
                      placeholder="enter title.."
                      onChange={handleUserInput}
                      value={regularizeRequest.clockInTime}
                    />
                  </div>
                  <div class="mb-3">
                    <label for="title" class="form-label">
                      <b>Clock Out Time</b>
                    </label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="title"
                      name="clockOutTime"
                      onChange={handleUserInput}
                      value={regularizeRequest.clockOutTime}
                    />
                  </div>

                  <div class="mb-3">
                    <label for="description" class="form-label">
                      <b>Reason</b>
                    </label>
                    <textarea
                      class="form-control"
                      id="reason"
                      rows="3"
                      name="reason"
                      placeholder="enter reason.."
                      onChange={handleUserInput}
                      value={regularizeRequest.reason}
                    />
                  </div>

                  <div className="d-flex aligns-items-center justify-content-center mb-2">
                    <button
                      type="submit"
                      onClick={regularizeAttendance}
                      class="btn bg-color custom-bg-text"
                    >
                      Regularize
                    </button>
                  </div>

                  <ToastContainer />
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

export default EmployeeAttendanceManagerView;
