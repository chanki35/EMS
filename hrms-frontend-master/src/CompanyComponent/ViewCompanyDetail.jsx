import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";

const ViewCompanyDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { company } = location.state || {}; // Retrieve the company object from state

  const admin = JSON.parse(sessionStorage.getItem("active-admin"));

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    return date.toLocaleString(); // Format the epoch time as a human-readable date
  };

  const updateCompanyStatus = (companyId, status) => {
    // e.preventDefault();

    fetch(
      `${BASE_URL}/api/company/update/status?companyId=${companyId}&status=${status}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //    Authorization: "Bearer " + jwtToken,
        },
        //   body: JSON.stringify(user),
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
              navigate("home");
            }, 1000);
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
    <div className="mt-2 d-flex align-items-center justify-content-center">
      <div className="form-card border-color" style={{ width: "50rem" }}>
        <div className="container-fluid">
          <div
            className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center"
            style={{
              borderRadius: "1em",
              height: "38px",
            }}
          >
            <h4 className="card-title">{company?.name || "Company Details"}</h4>
          </div>
          <div className="card-body mt-3">
            {/* Row 1 */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong className="text-color">Registration Number:</strong>{" "}
                <span className="text-dark">
                  {company?.registrationNumber || "N/A"}
                </span>
              </div>
              <div className="col-md-6 mb-3">
                <strong className="text-color">Industry Type:</strong>{" "}
                <span className="text-dark">
                  {company?.industryType || "N/A"}
                </span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong className="text-color">Address:</strong>{" "}
                <span className="text-dark">{company?.address || "N/A"}</span>
              </div>
              <div className="col-md-6 mb-3">
                <strong className="text-color">City:</strong>{" "}
                <span className="text-dark">{company?.city || "N/A"}</span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong className="text-color">State:</strong>{" "}
                <span className="text-dark">{company?.state || "N/A"}</span>
              </div>
              <div className="col-md-6 mb-3">
                <strong className="text-color">Country:</strong>{" "}
                <span className="text-dark">{company?.country || "N/A"}</span>
              </div>
            </div>

            {/* Row 4 */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong className="text-color">Contact Person:</strong>{" "}
                <span className="text-dark">
                  {company?.contactPersonName || "N/A"}
                </span>
              </div>
              <div className="col-md-6 mb-3">
                <strong className="text-color">Contact Email:</strong>{" "}
                <span className="text-dark">
                  {company?.contactEmail || "N/A"}
                </span>
              </div>
            </div>

            {/* Row 5 */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong className="text-color">Contact Phone:</strong>{" "}
                <span className="text-dark">
                  {company?.contactPhone || "N/A"}
                </span>
              </div>
              <div className="col-md-6 mb-3">
                <strong className="text-color">Website:</strong>{" "}
                <a
                  href={company?.websiteUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-dark"
                >
                  {company?.websiteUrl || "N/A"}
                </a>
              </div>
            </div>

            {/* Row 6 */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong className="text-color">Mandatory Working Hours:</strong>{" "}
                <span className="text-dark">
                  {company?.mandatoryWorkingHour || "N/A"} hours
                </span>
              </div>
              <div className="col-md-6 mb-3">
                <strong className="text-color">Status:</strong>{" "}
                <span
                  className={`badge ${
                    company?.status === "Active"
                      ? "bg-success text-white"
                      : company?.status === "Pending"
                      ? "bg-warning text-dark"
                      : "bg-danger"
                  }`}
                >
                  {company?.status || "N/A"}
                </span>
              </div>
            </div>

            {/* Row 7 */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong className="text-color">Created Date:</strong>{" "}
                <span className="text-dark">
                  {company?.createdDate
                    ? formatDateFromEpoch(company.createdDate)
                    : "N/A"}
                </span>
              </div>
              {admin && company?.status === "Pending" && (
                <div className="col-md-6 mb-3 d-flex justify-content-start align-items-center">
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => updateCompanyStatus(company.id, "Active")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => updateCompanyStatus(company.id, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}

              {admin && company?.status === "Active" && (
                <div className="col-md-6 mb-3 d-flex justify-content-start align-items-center">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() =>
                      updateCompanyStatus(company.id, "Deactivated")
                    }
                  >
                    Deactivate
                  </button>
                </div>
              )}

              {admin && company?.status === "Deactivated" && (
                <div className="col-md-6 mb-3 d-flex justify-content-start align-items-center">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => updateCompanyStatus(company.id, "Active")}
                  >
                    Activate
                  </button>
                </div>
              )}
              {admin && company?.status === "Rejected" && (
                <div className="col-md-6 mb-3 d-flex justify-content-start align-items-center">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => updateCompanyStatus(company.id, "Active")}
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ViewCompanyDetail;
