import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";

const RegisterCompanyForm = () => {
  const navigate = useNavigate();
  const companyManager = JSON.parse(sessionStorage.getItem("active-company"));
  const [company, setCompany] = useState({
    name: "",
    registrationNumber: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    contactPersonName: "",
    contactEmail: "",
    contactPhone: "",
    industryType: "",
    websiteUrl: "",
    userId: companyManager.id,
    mandatoryWorkingHour: "",
  });

  const handleUserInput = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const saveCompany = (e) => {
    e.preventDefault();

    let jwtToken;

    fetch(`${BASE_URL}/api/company/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //    Authorization: "Bearer " + jwtToken,
      },
      body: JSON.stringify(company),
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

            // Retrieve the existing data from sessionStorage
            const activeCompany = sessionStorage.getItem("active-company");

            if (activeCompany) {
              // Parse the JSON string into an object
              const activeCompanyObj = JSON.parse(activeCompany);

              // Update the company field
              activeCompanyObj.company = res.companies[0];

              // Convert the updated object back to a JSON string
              const updatedActiveCompany = JSON.stringify(activeCompanyObj);

              // Store the updated data back into sessionStorage
              sessionStorage.setItem("active-company", updatedActiveCompany);
            }

            setTimeout(() => {
              navigate("/company/view", {
                state: { company: res.companies[0] }, // Pass the company object in the state
              });
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
    <div>
      <div className="mt-2 d-flex aligns-items-center justify-content-center ms-5 me-5 mb-5 mt-4">
        <div className="form-card border-color text-color">
          <div className="container-fluid">
            <div
              className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center"
              style={{ borderRadius: "1em", height: "45px" }}
            >
              <h5 className="card-title">Register Company Here!!!</h5>
            </div>
            <div className="card-body mt-3">
              <form className="row g-3" onSubmit={saveCompany}>
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    <b>Company Name</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={company.name}
                    onChange={handleUserInput}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    <b>Registration Number</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="registrationNumber"
                    value={company.registrationNumber}
                    onChange={handleUserInput}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    <b>Address</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={company.address}
                    onChange={handleUserInput}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    <b>City</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={company.city}
                    onChange={handleUserInput}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    <b>State</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={company.state}
                    onChange={handleUserInput}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    <b>Postal Code</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="postalCode"
                    value={company.postalCode}
                    onChange={handleUserInput}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    <b>Country</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="country"
                    value={company.country}
                    onChange={handleUserInput}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    <b>Contact Person Name</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="contactPersonName"
                    value={company.contactPersonName}
                    onChange={handleUserInput}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    <b>Contact Email</b>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="contactEmail"
                    value={company.contactEmail}
                    onChange={handleUserInput}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    <b>Contact Phone</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="contactPhone"
                    value={company.contactPhone}
                    onChange={handleUserInput}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="industryType" className="form-label">
                    <b>Industry Type</b>
                  </label>
                  <select
                    className="form-control"
                    id="industryType"
                    name="industryType"
                    onChange={handleUserInput}
                    value={company.industryType}
                  >
                    <option value="" disabled>
                      -- Select Industry Type --
                    </option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Construction">Construction</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Energy">Energy</option>
                    <option value="Telecommunication">Telecommunication</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Legal Services">Legal Services</option>
                    <option value="Marketing and Advertising">
                      Marketing and Advertising
                    </option>
                    <option value="Non-Profit">Non-Profit</option>
                    <option value="Government">Government</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    <b>Website URL</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="websiteUrl"
                    value={company.websiteUrl}
                    onChange={handleUserInput}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    <b>Mandatory Working Hours</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="mandatoryWorkingHour"
                    value={company.mandatoryWorkingHour}
                    onChange={handleUserInput}
                  />
                </div>

                <div className="d-flex aligns-items-center justify-content-center">
                  <input
                    type="submit"
                    className="btn bg-color custom-bg-text"
                    value="Register Company"
                  />
                </div>
                <ToastContainer />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCompanyForm;
