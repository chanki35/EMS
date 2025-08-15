import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeaderHr = () => {
  let navigate = useNavigate();

  const hr = JSON.parse(sessionStorage.getItem("active-hr"));

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
    sessionStorage.removeItem("active-hr");
    sessionStorage.removeItem("hr-jwtToken");

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
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle text-color"
          href="#"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <b> Department</b>
        </a>
        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
          <li className="nav-item">
            <Link
              to="/hr/company/department/add"
              className="nav-link active"
              aria-current="page"
            >
              <b className="text-color">Add Department</b>
            </Link>
          </li>
          <li>
            <Link
              to="/hr/company/department/view"
              className="nav-link active"
              aria-current="page"
            >
              <b className="text-color">View Departments</b>
            </Link>
          </li>
        </ul>
      </li>

      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle text-color"
          href="#"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <b> Designation</b>
        </a>
        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
          <li>
            <Link
              to="/hr/company/designation/view"
              className="nav-link active"
              aria-current="page"
            >
              <b className="text-color">View Designations</b>
            </Link>
          </li>
        </ul>
      </li>

      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle text-color"
          href="#"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <b> Employees</b>
        </a>
        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
          <li className="nav-item">
            <Link
              to="/user/employee/register"
              className="nav-link active"
              aria-current="page"
            >
              <b className="text-color">Register Employee</b>
            </Link>
          </li>
          <li>
            <Link
              to="/hr/company/employee/view"
              className="nav-link active"
              aria-current="page"
            >
              <b className="text-color">View Employees</b>
            </Link>
          </li>
        </ul>
      </li>

      <li>
        <Link
          to="/company/view"
          className="nav-link active"
          aria-current="page"
          state={{ company: hr.company }} // Pass company as state
        >
          <b className="text-color">View Company</b>
        </Link>
      </li>

      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle text-color"
          href="#"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <b>Holidays</b>
        </a>
        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
          <li className="nav-item">
            <Link
              to="/hr/company/holiday/add"
              className="nav-link active"
              aria-current="page"
            >
              <b className="text-color">Add</b>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/hr/company/holiday/view"
              className="nav-link active"
              aria-current="page"
            >
              <b className="text-color">View</b>
            </Link>
          </li>
        </ul>
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

export default HeaderHr;
