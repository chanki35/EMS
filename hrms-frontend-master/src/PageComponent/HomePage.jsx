import attendance_mng from "./../images/attendance_mng.png";
import Carousel from "./Carousel";
import desgination_mng from "./../images/desgination_mng.png";
import employee_mng from "./../images/employee_mng.png";
import leave_mng from "./../images/leave_mng.png";
import payroll_mng from "./../images/payroll_mng.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <Carousel />

      <div className="container text-center mt-5">
        <h1 className="display-4">Streamline Your HR Operations with Ease</h1>
        <p className="lead">
          A comprehensive HR Management System designed for modern businesses to
          efficiently manage employees, departments, and payroll.
        </p>
        <Link
          to="/user/company/register"
          className="btn btn-lg bg-color custom-bg-text mt-3"
        >
          Get Started
        </Link>
      </div>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4">
              <img
                src={employee_mng}
                alt="HR Employee Management"
                className="img-fluid mb-3"
                style={{ maxHeight: "150px" }}
              />
              <h3>HR & Employee Management</h3>
              <p>
                Manage employee records, roles, and departments efficiently with
                our easy-to-use HRMS platform.
              </p>
            </div>
            <div className="col-md-4">
              <img
                src={attendance_mng}
                alt="Attendance Tracking"
                className="img-fluid mb-3"
                style={{ maxHeight: "150px" }}
              />
              <h3>Automated Attendance Tracking</h3>
              <p>
                Monitor and manage employee attendance with real-time tracking
                and automated reports.
              </p>
            </div>
            <div className="col-md-4">
              <img
                src={leave_mng}
                alt="Leave Management"
                className="img-fluid mb-3"
                style={{ maxHeight: "150px" }}
              />
              <h3>Leave Management</h3>
              <p>
                Simplify leave requests and approvals with an intuitive
                leave-tracking system.
              </p>
            </div>
          </div>
          <div className="row text-center mt-4">
            <div className="col-md-6">
              <img
                src={payroll_mng}
                alt="Payslip Management"
                className="img-fluid mb-3"
                style={{ maxHeight: "150px" }}
              />
              <h3>Payroll & Payslip Management</h3>
              <p>
                Generate accurate payslips and manage employee payrolls
                effortlessly.
              </p>
            </div>
            <div className="col-md-6">
              <img
                src={desgination_mng}
                alt="Department & Designation Management"
                className="img-fluid mb-3"
                style={{ maxHeight: "150px" }}
              />
              <h3>Department & Designation Management</h3>
              <p>
                Organize your workforce with a structured department and
                designation management system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">What Our Clients Say</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="card p-3">
                <p>
                  "Managing our HR operations has never been easier! This EMS
                  simplified everything from payroll to attendance tracking."
                </p>
                <p className="text-end">
                  <strong>- HR Manager, XYZ Corp</strong>
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3">
                <p>
                  "An all-in-one platform that streamlined our HR processes and
                  improved efficiency. Highly recommended!"
                </p>
                <p className="text-end">
                  <strong>- CEO, ABC Enterprises</strong>
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3">
                <p>
                  "The ease of use and automation features have saved us so much
                  time. A must-have for any growing company!"
                </p>
                <p className="text-end">
                  <strong>- HR Executive, DEF Solutions</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section text-white text-center py-5">
        <div className="container text-color">
          <h2>Empower Your HR Team Today</h2>
          <p className="lead">
            Join businesses that have transformed their HR operations with our
            powerful EMS solution.
          </p>
          <Link
            to="/user/company/register"
            className="btn btn-lg bg-color custom-bg-text"
          >
            Register Your Company
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
