import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import BASE_URL from "../config";
import { ToastContainer, toast } from "react-toastify";

const ViewAllDepartments = () => {
  const hr = JSON.parse(sessionStorage.getItem("active-hr"));
  const hr_jwtToken = sessionStorage.getItem("hr-jwtToken");

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [showAddDesignationModal, setShowAddDesignationModal] = useState(false);
  const handleAddDesignationClose = () => setShowAddDesignationModal(false);
  const handleAddDesignationShow = () => setShowAddDesignationModal(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState(0);

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    const getAllDepartment = async () => {
      const departments = await retrieveAllDepartment();
      if (departments) {
        setDepartments(departments.departments);
      }
    };

    if (departmentId !== 0) {
      const getAllDepartmentDesignations = async () => {
        const designations = await retrieveDepartmentDesignations();
        if (designations) {
          setDesignations(designations.designations);
        }
      };
      getAllDepartmentDesignations();
    }

    getAllDepartment();
  }, [departmentId]);

  const retrieveAllDepartment = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/department/fetch/company-wise?companyId=${hr.company.id}`
    );
    console.log(response.data);
    return response.data;
  };

  const retrieveDepartmentDesignations = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/designation/fetch/company-department-wise?companyId=${hr.company.id}&departmentId=${departmentId}`
    );
    console.log(response.data);
    return response.data;
  };

  const deleteDepartment = (departmentId, e) => {
    fetch(`${BASE_URL}/api/department/delete?departmentId=${departmentId}`, {
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

  const updateDepartment = (department) => {
    navigate("/hr/company/department/update", { state: department });
  };

  const viewDesignations = (departmentId) => {
    setDepartmentId(departmentId);
    handleShow();
  };

  const addDesignation = (departmentId) => {
    setDepartmentId(departmentId);
    handleAddDesignationShow();
  };

  const saveDesignation = (e) => {
    let data = {
      name,
      description,
      departmentId: departmentId,
      companyId: hr.company.id,
    };

    fetch(`${BASE_URL}/api/designation/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //     Authorization: "Bearer " + hr_jwtToken,
      },
      body: JSON.stringify(data),
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
            }, 2000); // Redirect after 3 seconds
          } else {
            toast.error("It Seems Server is down!!!", {
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
    e.preventDefault();
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
          <h2>All Departments</h2>
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
                  <th scope="col">Department Id</th>
                  <th scope="col">Department Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Designation</th>
                  <th scope="col">Manager</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((department) => {
                  return (
                    <tr>
                      <td>
                        <b>{department.id}</b>
                      </td>
                      <td>
                        <b>{department.name}</b>
                      </td>
                      <td>
                        <b>{department.description}</b>
                      </td>
                      <td>
                        <button
                          onClick={() => addDesignation(department.id)}
                          className="btn btn-sm bg-color custom-bg-text ms-2"
                        >
                          Add
                        </button>

                        <button
                          onClick={() => viewDesignations(department.id)}
                          className="btn btn-sm bg-color custom-bg-text ms-2 "
                        >
                          View
                        </button>
                      </td>
                      <td>
                        {(() => {
                          if (
                            department.projectManagerPresent &&
                            department.projectManagerPresent === "No"
                          ) {
                            return (
                              <Link
                                to="/user/employee/register"
                                state={{ department: department }}
                                className="btn btn-sm bg-color custom-bg-text"
                              >
                                Add Manager
                              </Link>
                            );
                          } else {
                            return (
                              <Link
                                to={`/employee/view?employeeUserId=${department.projectManagerId}`}
                                className="btn btn-sm bg-color custom-bg-text"
                              >
                                View Manager
                              </Link>
                            );
                          }
                        })()}
                      </td>
                      <td>
                        <button
                          onClick={() => updateDepartment(department)}
                          className="btn btn-sm bg-color custom-bg-text ms-2"
                        >
                          Update
                        </button>

                        <button
                          onClick={() => deleteDepartment(department.id)}
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

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title
            style={{
              borderRadius: "1em",
            }}
          >
            Designations
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">Designation Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {designations.map((designation) => {
                  return (
                    <tr>
                      <td>
                        <b>{designation.name}</b>
                      </td>
                      <td>
                        <b>{designation.description}</b>
                      </td>
                      <td>
                        <b>{designation.status}</b>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAddDesignationModal}
        onHide={handleAddDesignationClose}
        size="lg"
      >
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title
            style={{
              borderRadius: "1em",
            }}
          >
            Add Designation
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
                <h5 class="card-title">Add Designation</h5>
              </div>
              <div class="card-body text-color mt-3">
                <form>
                  <div class="mb-3">
                    <label for="title" class="form-label">
                      <b>Designation Name</b>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="title"
                      placeholder="enter title.."
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      value={name}
                    />
                  </div>
                  <div class="mb-3">
                    <label for="description" class="form-label">
                      <b>Designation Description</b>
                    </label>
                    <textarea
                      class="form-control"
                      id="description"
                      rows="3"
                      placeholder="enter description.."
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      value={description}
                    />
                  </div>

                  <div className="d-flex aligns-items-center justify-content-center mb-2">
                    <button
                      type="submit"
                      onClick={saveDesignation}
                      class="btn bg-color custom-bg-text"
                    >
                      Add Designation
                    </button>
                  </div>

                  <ToastContainer />
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddDesignationClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewAllDepartments;
