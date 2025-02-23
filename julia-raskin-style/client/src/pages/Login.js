import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // ✅ Validation with Yup
import { loginUser } from "../axiosInstance"; 
import AuthContext from "../context/AuthContext";

import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // ✅ Fancy UI Styles

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loader State
  const navigate = useNavigate();

  // ✅ Form Validation with Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
  });

  // ✅ Submit Handler
  const handleSubmit = async (values, { setSubmitting }) => {
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(values.email, values.password); 
      console.log("✅ Login Successful:", data);

      localStorage.setItem("token", data.token); 
      setUser(data); 
      navigate(data.isAdmin ? "/admin" : "/"); 
    } catch (error) {
      console.error("❌ Login Failed:", error);
      setError(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Sign in to continue shopping</p>

        {error && <p className="error-message">{error}</p>}

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="input-group">
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="input-group">
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              <button type="submit" className="login-btn" disabled={isSubmitting}>
                {loading ? "Loading..." : "Login"}
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
