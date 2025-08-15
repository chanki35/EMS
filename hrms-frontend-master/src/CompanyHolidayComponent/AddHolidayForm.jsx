import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";

const AddHolidayForm = () => {
  const hr = JSON.parse(sessionStorage.getItem("active-hr"));
  const hr_jwtToken = sessionStorage.getItem("hr-jwtToken");

  let navigate = useNavigate();

  const [holidayRequest, setHolidayRequest] = useState({
    date: "",
    name: "",
    description: "",
    companyId: hr?.company?.id,
  });

  const handleUserInput = (e) => {
    setHolidayRequest({ ...holidayRequest, [e.target.name]: e.target.value });
  };

  const saveHoliday = (e) => {
    fetch(`${BASE_URL}/api/holiday/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //     Authorization: "Bearer " + hr_jwtToken,
      },
      body: JSON.stringify(holidayRequest),
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
              navigate("/home");
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
    <div>
      <div class="mt-2 d-flex aligns-items-center justify-content-center">
        <div class="form-card border-color" style={{ width: "25rem" }}>
          <div className="container-fluid">
            <div
              className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center"
              style={{
                borderRadius: "1em",
                height: "38px",
              }}
            >
              <h5 class="card-title">Add Holiday</h5>
            </div>
            <div class="card-body text-color mt-3">
              <form>
                <div class="mb-3">
                  <label for="title" class="form-label">
                    <b>Holiday Date</b>
                  </label>
                  <input
                    type="date"
                    class="form-control"
                    id="title"
                    name="date"
                    onChange={handleUserInput}
                    value={holidayRequest.date}
                  />
                </div>
                <div class="mb-3">
                  <label for="title" class="form-label">
                    <b>Holiday Name</b>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="enter title.."
                    name="name"
                    onChange={handleUserInput}
                    value={holidayRequest.name}
                  />
                </div>
                <div class="mb-3">
                  <label for="description" class="form-label">
                    <b>Holiday Description</b>
                  </label>
                  <textarea
                    class="form-control"
                    id="description"
                    rows="3"
                    placeholder="enter description.."
                    name="description"
                    onChange={handleUserInput}
                    value={holidayRequest.description}
                  />
                </div>

                <div className="d-flex aligns-items-center justify-content-center mb-2">
                  <button
                    type="submit"
                    onClick={saveHoliday}
                    class="btn bg-color custom-bg-text"
                  >
                    Add Holiday
                  </button>
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

export default AddHolidayForm;
