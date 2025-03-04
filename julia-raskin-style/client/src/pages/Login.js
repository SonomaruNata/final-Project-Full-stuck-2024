import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // ✅ Corrected import for Yup
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Use AuthContext
import { login } from "../services/authService"; // ✅ Import login function
import "./Login.css"; // ✅ Ensure CSS is added for styling

const Login = () => {
  const { setUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Form Validation Schema
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters long").required("Password is required"),
  });

  // ✅ Login Handler
  const handleSubmit = async (values, { setSubmitting }) => {
    setError("");
    setLoading(true);

    try {
      const user = await login(values);
      setUser(user);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        <p className="login-subtitle">Sign in to continue shopping</p>

        {error && <p className="error-message">{error}</p>}

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div className="input-group">
                <label>Email</label>
                <Field type="email" name="email" placeholder="Enter your email" />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="input-group">
                <label>Password</label>
                <Field type="password" name="password" placeholder="Enter your password" />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              <button type="submit" className="login-btn" disabled={isSubmitting || loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
