import React, { useState, useContext } from "react";
import { loginUser } from "../axiosInstance"; // ✅ API Call Function
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // ✅ Fancy UI Styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // ✅ Clear previous errors

    try {
      const data = await loginUser(email, password); // ✅ Call API
      console.log("✅ Login Successful:", data);

      localStorage.setItem("token", data.token); // ✅ Store JWT token
      setUser(data); // ✅ Update AuthContext
      navigate(data.isAdmin ? "/admin" : "/"); // ✅ Redirect based on role
    } catch (error) {
      console.error("❌ Login Failed:", error);
      setError(error.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Sign in to continue shopping</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
