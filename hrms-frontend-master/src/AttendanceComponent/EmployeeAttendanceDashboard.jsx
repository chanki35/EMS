import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import BASE_URL from "../config";
import { ToastContainer, toast } from "react-toastify";

const EmployeeAttendanceDashboard = () => {
  const employee = JSON.parse(sessionStorage.getItem("active-employee"));
  const employee_jwtToken = sessionStorage.getItem("employee-jwtToken");

  const todaysDate = new Date().toISOString().split("T")[0]; // Define today's date

  const [leaveDate, setLeaveDate] = useState("");
  const [reason, setReason] = useState("");

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const showLeaveRequestModal = (leaveDate) => {
    setLeaveDate(leaveDate);
    handleShow();
  };

  const [workedTime, setWorkedTime] = useState("00:00:00");

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

  useEffect(() => {
    const interval = setInterval(() => {
      const attendance = attendances.find((att) => att.date === todaysDate);
      if (attendance && attendance.clockIn && !attendance.clockOut) {
        const clockInMillis = parseInt(attendance.clockIn, 10);
        const elapsedMillis = Date.now() - clockInMillis;
        const hours = String(Math.floor(elapsedMillis / 3600000)).padStart(
          2,
          "0"
        );
        const minutes = String(
          Math.floor((elapsedMillis % 3600000) / 60000)
        ).padStart(2, "0");
        const seconds = String(
          Math.floor((elapsedMillis % 60000) / 1000)
        ).padStart(2, "0");

        setWorkedTime(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [attendances]);

  const retrieveEmployeeCurrentMonthAttendanceEntries = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/attendance/fetch/employee/current-month?userId=${employee.id}`
    );
    console.log(response.data);
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    return date.toLocaleString(); // Format the epoch time as a human-readable date
  };

  const clockIn = (e) => {
    e.preventDefault();

    fetch(
      `${BASE_URL}/api/attendance/employee/clock-in?userId=${employee.id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //    Authorization: "Bearer " + employee_jwtToken,
        },
      }
    )
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

  const clockOut = (e) => {
    e.preventDefault();

    fetch(
      `${BASE_URL}/api/attendance/employee/clock-out?userId=${employee.id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //    Authorization: "Bearer " + employee_jwtToken,
        },
      }
    )
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

  const requestForLeave = (e) => {
    e.preventDefault();

    // Construct a properly formatted query string
    const data = {
      employeeUserId: employee.id,
      date: leaveDate,
      reason: reason,
    };

    fetch(`${BASE_URL}/api/leave/request/add`, {
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
          <div className="text-center mb-3">
            {attendances.some(
              (attendance) =>
                attendance.date === todaysDate &&
                attendance.workingStatus === "Working"
            ) &&
              attendances.map((attendance) => {
                if (
                  attendance.date === todaysDate &&
                  attendance.workingStatus === "Working"
                ) {
                  return (
                    <div
                      key={attendance.id}
                      className="d-flex align-items-center justify-content-center"
                    >
                      {attendance.clockIn ? (
                        attendance.clockOut ? (
                          <b>
                            Clock In Time:{" "}
                            {formatDateFromEpoch(attendance.clockIn)} → Clock
                            Out Time: {formatDateFromEpoch(attendance.clockOut)}
                            <span className="ms-3 text-success">
                              Your Today's Attendance is Recorded
                            </span>
                          </b>
                        ) : (
                          <b className="d-flex align-items-center">
                            Clock In Time:{" "}
                            {formatDateFromEpoch(attendance.clockIn)} →
                            <button
                              className="btn btn-lg btn-danger ms-3"
                              onClick={(e) => clockOut(e)}
                            >
                              Clock Out
                            </button>
                            <span className="ms-3 text-primary">
                              <h4> Worked: {workedTime}</h4>
                            </span>
                          </b>
                        )
                      ) : (
                        <button
                          className="btn btn-lg btn-success"
                          onClick={(e) => clockIn(e)}
                        >
                          Clock In
                        </button>
                      )}
                    </div>
                  );
                }
                return null;
              })}
          </div>

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
                        <td>
                          {attendance.workingStatus === "Working" &&
                            attendanceDate >= today &&
                            attendance.leaveRequest === null && (
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() =>
                                  showLeaveRequestModal(attendance.date)
                                }
                              >
                                Apply Leave
                              </button>
                            )}

                          {attendance.workingStatus === "Working" &&
                            attendanceDate >= today &&
                            attendance.leaveRequest !== null && (
                              <b className="text-center">
                                Applied : {attendance.leaveRequest.status}
                              </b>
                            )}
                        </td>
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
            Apply for Leave Form!!!
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
                <h5 class="card-title">Leave Request</h5>
              </div>
              <div class="card-body text-color mt-3">
                <form>
                  <div class="mb-3">
                    <label for="title" class="form-label">
                      <b>Leave Request Date</b>
                    </label>
                    <input type="text" class="form-control" value={leaveDate} />
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
                      onChange={(e) => setReason(e.target.value)}
                      value={reason}
                    />
                  </div>

                  <div className="d-flex aligns-items-center justify-content-center mb-2">
                    <button
                      type="submit"
                      onClick={requestForLeave}
                      class="btn bg-color custom-bg-text"
                    >
                      Apply
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

export default EmployeeAttendanceDashboard;
