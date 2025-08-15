import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import BASE_URL from "../config";
import { Link } from "react-router-dom";

const ViewRejectedCompany = () => {
  const [allCompany, setAllCompany] = useState([]);
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  useEffect(() => {
    const getAllCompanys = async () => {
      const allCompanys = await retrieveAllCompany();
      if (allCompanys) {
        setAllCompany(allCompanys.companies);
      }
    };

    getAllCompanys();
  }, []);

  const retrieveAllCompany = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/company/fetch/status-wise?status=Rejected`,
      {
        headers: {
          //   Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      }
    );
    console.log(response.data);
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
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
          <h2> Rejected Companies</h2>
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
                  <th scope="col">Name</th>
                  <th scope="col">Registration Number</th>
                  <th scope="col">Contact Person</th>
                  <th scope="col">Email</th>
                  <th scope="col">Industry</th>
                  <th scope="col">Created Date</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {allCompany.map((company) => {
                  return (
                    <tr key={company.id}>
                      <td>
                        <b>{company.name}</b>
                      </td>
                      <td>
                        <b>{company.registrationNumber}</b>
                      </td>
                      <td>
                        <b>{company.contactPersonName}</b>
                      </td>
                      <td>
                        <b>{company.contactEmail}</b>
                      </td>

                      <td>
                        <b>{company.industryType}</b>
                      </td>

                      <td>
                        <b>{formatDateFromEpoch(company.createdDate)}</b>
                      </td>
                      <td>
                        <Link
                          to="/company/view"
                          state={{ company: company }}
                          className="btn btn-sm bg-color custom-bg-text"
                        >
                          View
                        </Link>
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

export default ViewRejectedCompany;
