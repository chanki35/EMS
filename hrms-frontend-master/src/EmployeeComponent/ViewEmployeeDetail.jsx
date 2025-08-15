import { useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import BASE_URL from "../config";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";

const ViewEmployeeDetail = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const employeeUserId = params.get("employeeUserId");

  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState(null);
  const [selectedGovtDoc, setSelectedGovtDoc] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [showGovDocModal, setShowGovDocModal] = useState(false);
  const handleGovDocModalClose = () => setShowGovDocModal(false);
  const handleGovDocModalShow = () => setShowGovDocModal(true);

  const [showResumeDocModal, setShowResumeDocModal] = useState(false);
  const handleResumeDocModalClose = () => setShowResumeDocModal(false);
  const handleResumeDocModalShow = () => setShowResumeDocModal(true);

  const [empoyeeUser, setEmployeeUser] = useState({});

  let navigate = useNavigate();

  useEffect(() => {
    const getEmployeeUser = async () => {
      const res = await retrieveEmployeeUser();
      if (res) {
        setEmployeeUser(res.users[0]);
      }
    };

    getEmployeeUser();
  }, []);

  const retrieveEmployeeUser = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/user/fetch/user-id?userId=${employeeUserId}`
    );
    console.log(response.data);
    return response.data;
  };

  const admin = JSON.parse(sessionStorage.getItem("active-admin"));

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    return date.toLocaleString(); // Format the epoch time as a human-readable date
  };

  const saveEmployeeDocument = (e) => {
    e.preventDefault();
    if (
      selectedResume === null ||
      selectedProfilePhoto == null ||
      selectedGovtDoc == null
    ) {
      toast.error("invalid input!!!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    }

    const formData = new FormData();
    formData.append("id", empoyeeUser.employee.id);
    formData.append("resumeFile", selectedResume);
    formData.append("governmentProofImage", selectedGovtDoc);
    formData.append("profileImage", selectedProfilePhoto);

    axios
      .put("http://localhost:8080/api/employee/add/document", formData, {
        headers: {
          //       Authorization: "Bearer " + guide_jwtToken, // Replace with your actual JWT token
        },
      })
      .then((resp) => {
        let response = resp.data;

        if (response.success) {
          toast.success(response.responseMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setTimeout(() => {
            navigate("/home");
          }, 2000); // Redirect after 3 seconds
        } else if (!response.success) {
          toast.error(response.responseMessage, {
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
          // }, 2000); // Redirect after 3 seconds
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
          // setTimeout(() => {
          //   window.location.reload(true);
          // }, 2000); // Redirect after 3 seconds
        }
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
        // }, 2000); // Redirect after 3 seconds
      });
  };

  const showAddDocumentModal = () => {
    handleShow();
  };

  const downloadResume = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/employee/document/${empoyeeUser.employee.resumeFileName}/download`,
        {
          responseType: "blob", // Important to handle binary data
        }
      );

      // Create a Blob from the response data
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Create a download link and trigger the download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = empoyeeUser.employee.resumeFileName;
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading resume:", error);
      // Handle error as needed
    }
  };

  const downloadGovDoc = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/employee/document/${empoyeeUser.employee.governmentProofFileImage}/download`,
        {
          responseType: "blob", // Important to handle binary data
        }
      );

      // Create a Blob from the response data
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Create a download link and trigger the download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = empoyeeUser.employee.governmentProofFileImage;
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading resume:", error);
      // Handle error as needed
    }
  };

  return (
    <div className="mt-3 ms-5 me-5 mb-5 d-flex align-items-center justify-content-center">
      <div className="form-card border-color container-fluid">
        <div className="container-fluid">
          <div
            className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center"
            style={{
              borderRadius: "1em",
              height: "38px",
            }}
          >
            <h4 className="card-title">Employee Detail</h4>
          </div>

          <div className="card-body mt-3">
            {/* Show Upload Documents button if profileImage is null */}

            {empoyeeUser?.employee?.profileImage === null && (
              <h5 className="text-center text-danger mb-3">
                Profile Yet to be updated
              </h5>
            )}

            <h5 className="mb-3">Profile Photo</h5>

            {empoyeeUser?.employee?.profileImage === null ? (
              <div className="text-center mt-3">
                <button
                  className="btn bg-color custom-bg-text"
                  onClick={() => showAddDocumentModal()}
                >
                  Upload Documents
                </button>
              </div>
            ) : (
              <div className="text-center mt-3">
                <img
                  src={`${BASE_URL}/api/employee/${empoyeeUser?.employee?.profileImage}`}
                  alt="profile pic"
                  className="rounded-circle profile-photo"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    border: "2px solid #ddd",
                  }}
                />
              </div>
            )}

            {/* Personal Details */}
            <h5 className="mb-3">Personal Details</h5>
            <div className="row">
              <div className="col-md-4">
                <strong>Name:</strong> {empoyeeUser?.employee?.firstName}{" "}
                {empoyeeUser?.employee?.lastName}
              </div>
              <div className="col-md-4">
                <strong>Email:</strong> {empoyeeUser?.employee?.emailId}
              </div>
              <div className="col-md-4">
                <strong>Phone:</strong> {empoyeeUser?.employee?.phoneNo}
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-4">
                <strong>Gender:</strong> {empoyeeUser?.employee?.gender}
              </div>
              <div className="col-md-4">
                <strong>Date of Birth:</strong>{" "}
                {empoyeeUser?.employee?.dateOfBirth}
              </div>
              <div className="col-md-4">
                <strong>Marital Status:</strong>{" "}
                {empoyeeUser?.employee?.maritalStatus}
              </div>
            </div>

            {/* Employment Details */}
            <h5 className="mt-4 mb-3">Employment Details</h5>
            <div className="row">
              <div className="col-md-4">
                <strong>Employee Code:</strong>{" "}
                {empoyeeUser?.employee?.employeeCode}
              </div>
              <div className="col-md-4">
                <strong>Designation:</strong>{" "}
                {empoyeeUser?.employee?.designation?.name}
              </div>
              <div className="col-md-4">
                <strong>Department:</strong>{" "}
                {empoyeeUser?.employee?.department?.name}
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-4">
                <strong>Employment Type:</strong>{" "}
                {empoyeeUser?.employee?.employmentType}
              </div>
              <div className="col-md-4">
                <strong>Date of Joining:</strong>{" "}
                {empoyeeUser?.employee?.dateOfJoining}
              </div>
              <div className="col-md-4">
                <strong>Work Location:</strong>{" "}
                {empoyeeUser?.employee?.workLocation}
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-4">
                <strong>Available Leaves:</strong>{" "}
                {empoyeeUser?.employee?.availableLeave}
              </div>
            </div>

            {/* Show Project Manager Details if Employee is NOT a Project Manager */}
            {empoyeeUser?.employee?.designation?.name !== "Project Manager" &&
              empoyeeUser?.employee?.reportingManager && (
                <>
                  <h5 className="mt-4 mb-3">Project Manager Details</h5>
                  <div className="row">
                    <div className="col-md-4">
                      <strong>Name:</strong>{" "}
                      {empoyeeUser?.employee?.reportingManager?.firstName}{" "}
                      {empoyeeUser?.employee?.reportingManager?.lastName}
                    </div>
                    <div className="col-md-4">
                      <strong>Email:</strong>{" "}
                      {empoyeeUser?.employee?.reportingManager?.emailId}
                    </div>
                    <div className="col-md-4">
                      <strong>Phone:</strong>{" "}
                      {empoyeeUser?.employee?.reportingManager?.phoneNo}
                    </div>
                  </div>
                </>
              )}

            {/* HR Details */}
            <h5 className="mt-4 mb-3">HR Details</h5>
            <div className="row">
              <div className="col-md-4">
                <strong>Name:</strong> {empoyeeUser?.employee?.hr?.firstName}{" "}
                {empoyeeUser?.hr?.lastName}
              </div>
              <div className="col-md-4">
                <strong>Email:</strong> {empoyeeUser?.employee?.hr?.emailId}
              </div>
              <div className="col-md-4">
                <strong>Phone:</strong> {empoyeeUser?.employee?.hr?.phoneNo}
              </div>
            </div>

            {/* Salary Details */}
            <h5 className="mt-4 mb-3">Salary Details</h5>
            <div className="row">
              <div className="col-md-4">
                <strong>CTC:</strong> ₹{empoyeeUser?.employee?.ctc}
              </div>
              <div className="col-md-4">
                <strong>Basic Salary:</strong> ₹
                {empoyeeUser?.employee?.basicSalary}
              </div>
              <div className="col-md-4">
                <strong>HRA:</strong> ₹{empoyeeUser?.employee?.hra}
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-4">
                <strong>LTA:</strong> ₹{empoyeeUser?.employee?.lta}
              </div>
              <div className="col-md-4">
                <strong>Conveyance Allowance:</strong> ₹
                {empoyeeUser?.employee?.conveyanceAllowance}
              </div>
              <div className="col-md-4">
                <strong>Retention Allowance:</strong> ₹
                {empoyeeUser?.employee?.retentionAllowance}
              </div>
            </div>

            {/* Banking Details */}
            <h5 className="mt-4 mb-3">Banking Details</h5>
            <div className="row">
              <div className="col-md-4">
                <strong>Bank Name:</strong> {empoyeeUser?.employee?.bankName}
              </div>
              <div className="col-md-4">
                <strong>Account Number:</strong>{" "}
                {empoyeeUser?.employee?.bankAccountNumber}
              </div>
              <div className="col-md-4">
                <strong>IFSC Code:</strong> {empoyeeUser?.employee?.ifscCode}
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-4">
                <strong>PF Number:</strong> {empoyeeUser?.employee?.pfNo}
              </div>
              <div className="col-md-4">
                <strong>UAN:</strong> {empoyeeUser?.employee?.uan}
              </div>
              <div className="col-md-4">
                <strong>PAN:</strong> {empoyeeUser?.employee?.panNumber}
              </div>
            </div>

            {/* Company Details */}
            <h5 className="mt-4 mb-3">Company Details</h5>
            <div className="row">
              <div className="col-md-4">
                <strong>Company Name:</strong> {empoyeeUser?.company?.name}
              </div>
              <div className="col-md-4">
                <strong>Registration Number:</strong>{" "}
                {empoyeeUser?.company?.registrationNumber}
              </div>
              <div className="col-md-4">
                <strong>Industry Type:</strong>{" "}
                {empoyeeUser?.company?.industryType}
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-4">
                <strong>Company Address:</strong>{" "}
                {empoyeeUser?.company?.address}
              </div>
              <div className="col-md-4">
                <strong>City:</strong> {empoyeeUser?.company?.city}
              </div>
              <div className="col-md-4">
                <strong>State:</strong> {empoyeeUser?.company?.state}
              </div>
            </div>

            {/* Emergency Contact */}
            <h5 className="mt-4 mb-3">Emergency Contact</h5>
            <div className="row mb-5">
              <div className="col-md-4">
                <strong>Contact Name:</strong>{" "}
                {empoyeeUser?.employee?.emergencyContactName}
              </div>
              <div className="col-md-4">
                <strong>Phone:</strong>{" "}
                {empoyeeUser?.employee?.emergencyContactPhone}
              </div>
              <div className="col-md-4">
                <strong>Relation:</strong>{" "}
                {empoyeeUser?.employee?.emergencyContactRelation}
              </div>
            </div>

            {/* Documents Section */}
            <h5 className="mt-4 mb-3">Documents</h5>
            <div className="row mb-5">
              <div className="col-md-4">
                <strong>Resume:</strong>{" "}
                {empoyeeUser?.employee?.resumeFileName ? (
                  <button
                    className="btn btn-sm bg-color custom-bg-text "
                    onClick={() => downloadResume()}
                  >
                    Download
                  </button>
                ) : (
                  "Not Uploaded"
                )}
              </div>
              <div className="col-md-4">
                <strong>Government Proof:</strong>{" "}
                {empoyeeUser?.employee?.governmentProofFileImage ? (
                  <button
                    className="btn btn-sm bg-color custom-bg-text"
                    onClick={() => downloadGovDoc()}
                  >
                    Download
                  </button>
                ) : (
                  "Not Uploaded"
                )}
              </div>
              {/* <div className="col-md-4">
                <strong>Profile Image:</strong>{" "}
                {empoyeeUser?.employee?.profileImage
                  ? "Uploaded"
                  : "Not Uploaded"}
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />

      <Modal show={showModal} onHide={handleClose} size="md">
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title
            style={{
              borderRadius: "1em",
            }}
          >
            Add Employee Document
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
                <h5 class="card-title">Add Employee Document</h5>
              </div>
              <div class="card-body text-color mt-3">
                <form>
                  <div className=" mb-3">
                    <label for="formFile" class="form-label">
                      <b> Select Profile Photo</b>
                    </label>
                    <input
                      class="form-control"
                      type="file"
                      id="formFile"
                      onChange={(e) =>
                        setSelectedProfilePhoto(e.target.files[0])
                      }
                      required
                    />
                  </div>

                  <div className=" mb-3">
                    <label for="formFile" class="form-label">
                      <b> Select Resume</b>
                    </label>
                    <input
                      class="form-control"
                      type="file"
                      id="formFile"
                      onChange={(e) => setSelectedResume(e.target.files[0])}
                      required
                    />
                  </div>

                  <div className=" mb-3">
                    <label for="formFile" class="form-label">
                      <b> Select Govt Doc</b>
                    </label>
                    <input
                      class="form-control"
                      type="file"
                      id="formFile"
                      onChange={(e) => setSelectedGovtDoc(e.target.files[0])}
                      required
                    />
                  </div>

                  <div className="d-flex aligns-items-center justify-content-center mb-2">
                    <button
                      type="submit"
                      onClick={saveEmployeeDocument}
                      class="btn bg-color custom-bg-text"
                    >
                      Add Document
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

      <Modal show={showGovDocModal} onHide={handleGovDocModalClose} fullscreen>
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title
            style={{
              borderRadius: "1em",
            }}
          >
            Employee Govt. Document
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={`http://localhost:8080/api/employee/document/${empoyeeUser?.employee?.governmentProofFileImage}/view`}
            width="100%"
            height="100%" // Set height to 100% for full coverage
            style={{ border: "none" }}
            title="Document Preview"
          ></iframe>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleGovDocModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showResumeDocModal}
        onHide={handleGovDocModalShow}
        fullscreen
      >
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title
            style={{
              borderRadius: "1em",
            }}
          >
            Employee Resume
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={`http://localhost:8080/api/employee/document/${empoyeeUser?.employee?.resumeFileName}/view`}
            width="100%"
            height="100%" // Set height to 100% for full coverage
            style={{ border: "none" }}
            title="Document Preview"
          ></iframe>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleResumeDocModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewEmployeeDetail;
