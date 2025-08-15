import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeaderCompany = () => {
  let navigate = useNavigate();

  const companyUser = JSON.parse(sessionStorage.getItem("active-company"));

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
    sessionStorage.removeItem("active-company");
    sessionStorage.removeItem("company-jwtToken");
    setTimeout(() => {
      navigate("/home");
      window.location.reload(true);
    }, 2000); // Redirect after 3 seconds
  };

  const navigateToChangePasswordPage = () => {
    navigate("/customer/changePassword");
  };

  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 me-5">
      {companyUser?.company && (
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
                to="/user/hr/register"
                className="nav-link active"
                aria-current="page"
              >
                <b className="text-color">Register HR</b>
              </Link>
            </li>
            <li>
              <Link
                to="/company/hr/view"
                className="nav-link active"
                aria-current="page"
              >
                <b className="text-color">View HRs</b>
              </Link>
            </li>
            <li>
              <Link
                to="/company/employee/view"
                className="nav-link active"
                aria-current="page"
              >
                <b className="text-color">View Employees</b>
              </Link>
            </li>
          </ul>
        </li>
      )}

      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle text-color"
          href="#"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <b> My Company</b>
        </a>
        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
          {companyUser?.company ? (
            <li>
              <Link
                to="/company/view"
                className="nav-link active"
                aria-current="page"
                state={{ company: companyUser.company }} // Pass company as state
              >
                <b className="text-color">View Company</b>
              </Link>
            </li>
          ) : (
            <li>
              <Link
                to="/company/add"
                className="nav-link active"
                aria-current="page"
              >
                <b className="text-color">Add Company</b>
              </Link>
            </li>
          )}
        </ul>
      </li>

      <li className="nav-item">
        <Link
          to=""
          className="nav-link active"
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

export default HeaderCompany;
