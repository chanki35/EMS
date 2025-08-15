import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import BASE_URL from "../config";
import { ToastContainer, toast } from "react-toastify";

const ViewAllDesignations = () => {
  const hr = JSON.parse(sessionStorage.getItem("active-hr"));
  const hr_jwtToken = sessionStorage.getItem("hr-jwtToken");

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [designationId, setDesignationId] = useState(0); // for fetching the employees

  const [employeeUsers, setEmployeeUsers] = useState([]);
  const [designations, setDesignations] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    const getAllDesignation = async () => {
      const designations = await retrieveAllDesignation();
      if (designations) {
        setDesignations(designations.designations);
      }
    };

    getAllDesignation();
  }, []);

  const retrieveAllDesignation = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/designation/fetch/company-wise?companyId=${hr.company.id}`
    );
    console.log(response.data);
    return response.data;
  };

  const deleteDesignation = (designationId, e) => {
    fetch(`${BASE_URL}/api/designation/delete?designationId=${designationId}`, {
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

  const updateDesignation = (designation) => {
    navigate("/hr/company/designation/update", { state: designation });
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
          <h2>All Designations</h2>
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
                  <th scope="col">Designation Id</th>
                  <th scope="col">Designation Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Department Name</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {designations.map((designation) => {
                  return (
                    <tr>
                      <td>
                        <b>{designation.id}</b>
                      </td>
                      <td>
                        <b>{designation.name}</b>
                      </td>
                      <td>
                        <b>{designation.description}</b>
                      </td>
                      <td>
                        <b>{designation.department.name}</b>
                      </td>

                      <td>
                        <b>{designation.status}</b>
                      </td>

                      <td>
                        <button
                          onClick={() => updateDesignation(designation)}
                          className="btn btn-sm bg-color custom-bg-text ms-2"
                        >
                          Update
                        </button>

                        <button
                          onClick={() => deleteDesignation(designation.id)}
                          className="btn btn-sm bg-color custom-bg-text ms-2 "
                        >
                          Delete
                        </button>
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

export default ViewAllDesignations;
