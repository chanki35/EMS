import { Routes, Route } from "react-router-dom";
import Header from "./NavbarComponent/Header";
import AdminRegisterForm from "./UserComponent/AdminRegisterForm";
import UserLoginForm from "./UserComponent/UserLoginForm";
import UserRegister from "./UserComponent/UserRegister";
import HomePage from "./PageComponent/HomePage";
import RegisterCompanyForm from "./CompanyComponent/RegisterCompanyForm";
import ViewCompanyDetail from "./CompanyComponent/ViewCompanyDetail";
import ViewAllCompanyManagers from "./UserComponent/ViewAllCompanyManagers";
import ViewPendingCompany from "./CompanyComponent/ViewPendingCompany";
import ViewApprovedCompany from "./CompanyComponent/ViewApprovedCompany";
import ViewRejectedCompany from "./CompanyComponent/ViewRejectedCompany";
import ViewDeactivatedCompany from "./CompanyComponent/ViewDeactivatedCompany";
import ViewCompanyHr from "./UserComponent/ViewCompanyHr";
import ViewCompanyEmployees from "./UserComponent/ViewCompanyEmployees";
import AddDepartmentForm from "./DepartmentComponent/AddDepartmentForm";
import ViewAllDepartments from "./DepartmentComponent/ViewAllDepartments";
import UpdateDepartmentForm from "./DepartmentComponent/UpdateDepartmentForm";
import ViewHRCompanyEmployees from "./UserComponent/ViewHRCompanyEmployees";
import ViewAllDesignations from "./DesignationComponent/ViewAllDesignations";
import UpdateDesignationForm from "./DesignationComponent/UpdateDesignationForm";
import AddEmployeeDetail from "./EmployeeComponent/AddEmployeeDetail";
import ViewEmployeeDetail from "./EmployeeComponent/ViewEmployeeDetail";
import AddHolidayForm from "./CompanyHolidayComponent/AddHolidayForm";
import ViewCompanyHolidays from "./CompanyHolidayComponent/ViewCompanyHolidays";
import ViewEmployeeCompanyHolidays from "./CompanyHolidayComponent/ViewEmployeeCompanyHolidays";
import EmployeeAttendanceDashboard from "./AttendanceComponent/EmployeeAttendanceDashboard";
import EmployeeAttendanceManagerView from "./AttendanceComponent/EmployeeAttendanceManagerView";
import ViewProjectManagerEmployees from "./UserComponent/ViewProjectManagerEmployees";
import EmployeeLeaveManagement from "./LeaveManagementComponent/EmployeeLeaveManagement";
import ManagerEmployeesLeaveManagement from "./LeaveManagementComponent/ManagerEmployeesLeaveManagement";
import ViewEmployeePayslip from "./PayslipManagementComponent/ViewEmployeePayslip";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/user/admin/register" element={<AdminRegisterForm />} />
        <Route path="/user/login" element={<UserLoginForm />} />
        <Route path="/user/company/register" element={<UserRegister />} />
        <Route path="/user/hr/register" element={<UserRegister />} />
        <Route path="/user/employee/register" element={<UserRegister />} />
        <Route path="/company/add" element={<RegisterCompanyForm />} />
        <Route path="/company/view" element={<ViewCompanyDetail />} />
        <Route
          path="/admin/company/manager/view"
          element={<ViewAllCompanyManagers />}
        />
        <Route path="/admin/company/pending" element={<ViewPendingCompany />} />
        <Route
          path="/admin/company/approved"
          element={<ViewApprovedCompany />}
        />
        <Route
          path="/admin/company/rejected"
          element={<ViewRejectedCompany />}
        />
        <Route
          path="/admin/company/deactivated"
          element={<ViewDeactivatedCompany />}
        />
        <Route path="/company/hr/view" element={<ViewCompanyHr />} />
        <Route
          path="/company/employee/view"
          element={<ViewCompanyEmployees />}
        />
        <Route
          path="/hr/company/employee/view"
          element={<ViewHRCompanyEmployees />}
        />
        <Route path="/employee/detail/add" element={<AddEmployeeDetail />} />
        <Route
          path="/employee/detail/view"
          element={<ViewCompanyEmployees />}
        />
        <Route
          path="/hr/company/department/add"
          element={<AddDepartmentForm />}
        />
        <Route
          path="/hr/company/department/view"
          element={<ViewAllDepartments />}
        />
        <Route
          path="/hr/company/department/update"
          element={<UpdateDepartmentForm />}
        />

        <Route
          path="/hr/company/designation/view"
          element={<ViewAllDesignations />}
        />
        <Route
          path="/hr/company/designation/update"
          element={<UpdateDesignationForm />}
        />
        <Route path="/employee/view" element={<ViewEmployeeDetail />} />
        <Route path="/hr/company/holiday/add" element={<AddHolidayForm />} />
        <Route
          path="/hr/company/holiday/view"
          element={<ViewCompanyHolidays />}
        />
        <Route
          path="/employee/company/holiday/view"
          element={<ViewEmployeeCompanyHolidays />}
        />

        <Route
          path="/employee/attendance/dashboard"
          element={<EmployeeAttendanceDashboard />}
        />
        <Route
          path="/manager/employee/employees"
          element={<ViewProjectManagerEmployees />}
        />
        <Route
          path="/employee/:employeeId/attendance/manager/view"
          element={<EmployeeAttendanceManagerView />}
        />
        <Route
          path="/employee/leave-management/view"
          element={<EmployeeLeaveManagement />}
        />
        <Route
          path="/manager/employee/leave-management/view"
          element={<ManagerEmployeesLeaveManagement />}
        />
        <Route
          path="/employee/:employeeId/payslip/view"
          element={<ViewEmployeePayslip />}
        />
      </Routes>
    </div>
  );
}

export default App;
