import AdminHeader from "./AdminHeader";
import HeaderCompany from "./HeaderCompany";
import HeaderEmployee from "./HeaderEmployee";
import HeaderHr from "./HeaderHr";
import NormalHeader from "./NormalHeader";

const RoleNav = () => {
  const company = JSON.parse(sessionStorage.getItem("active-company"));
  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const hr = JSON.parse(sessionStorage.getItem("active-hr"));
  const employee = JSON.parse(sessionStorage.getItem("active-employee"));

  if (company != null) {
    return <HeaderCompany />;
  } else if (admin != null) {
    return <AdminHeader />;
  } else if (hr != null) {
    return <HeaderHr />;
  } else if (employee != null) {
    return <HeaderEmployee />;
  } else {
    return <NormalHeader />;
  }
};

export default RoleNav;
