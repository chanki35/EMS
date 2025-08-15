import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeaderEmployee = () => {
  let navigate = useNavigate();

  const employee = JSON.parse(sessionStorage.getItem("active-employee"));

  const userLogout = () => {
    toast.success("logged out!!!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    sessionStorage.removeItem("active-employee");
    sessionStorage.removeItem("employee-jwtToken");

    setTimeout(() => {
      navigate("/home");
      window.location.reload(true);
    }, 2000); // Redirect after 3 seconds
  };

  const navigateToChangePasswordPage = () => {
    navigate("/customer/changePassword");
  };

  return (
    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 me-5">
      {employee?.employee && (
        <>
          <li>
            <Link
              to="/employee/attendance/dashboard"
              className="nav-link active"
              aria-current="page"
              state={{ company: employee.company }}
            >
              <b className="text-color">Attendance</b>
            </Link>
          </li>

          <li>
            <Link
              to={`/employee/leave-management/view`}
              className="nav-link active"
              aria-current="page"
            >
              <b className="text-color">Leave Management</b>
            </Link>
          </li>

          <li>
            <Link
              to={`/employee/${employee.employee.id}/payslip/view`}
              className="nav-link active"
              aria-current="page"
            >
              <b className="text-color">Payslip Management</b>
            </Link>
          </li>
        </>
      )}

      {employee?.employee?.designation?.name === "Project Manager" && (
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle text-color"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <b>My Employees</b>
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li className="nav-item">
              <Link
                to="/manager/employee/employees"
                className="nav-link active"
                aria-current="page"
              >
                <b className="text-color">My Employees</b>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/manager/employee/leave-management/view"
                className="nav-link active"
                aria-current="page"
              >
                <b className="text-color">Leave Management</b>
              </Link>
            </li>
          </ul>
        </li>
      )}

      <li>
        <Link
          to="/company/view"
          className="nav-link active"
          aria-current="page"
          state={{ company: employee.company }} // Pass company as state
        >
          <b className="text-color">View Company</b>
        </Link>
      </li>

      <li>
        <Link
          to="/employee/company/holiday/view"
          className="nav-link active"
          aria-current="page"
          state={{ company: employee.company }} // Pass company as state
        >
          <b className="text-color">Holidays</b>
        </Link>
      </li>

      <li>
        <Link
          to={`/employee/view?employeeUserId=${employee.id}`}
          className="nav-link active"
          aria-current="page"
        >
          <b className="text-color">My Profile</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link
          to=""
          class="nav-link active"
          aria-current="page"
          onClick={userLogout}
        >
          <b className="text-color">Logout</b>
        </Link>
        <ToastContainer />
      </li>
    </ul>
  );
};

export default HeaderEmployee;
