import { useState } from "react";
import api from "../api/axios";
import "./Signup.css"; // This imports Login.css via the @import
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", form);
      alert("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <span className="big-x-logo">𝕏</span>
      </div>
      
      <div className="login-right">
        <div className="login-box">
          <h1 className="lets-go">Join today.</h1>
          
          <form onSubmit={handleSignup}>
            <div className="input-group">
              <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <input name="username" placeholder="Username" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            </div>

            <button className="login-btn" type="submit">Sign Up</button>
          </form>

          <div className="login-footer">
            <p>Already have an account?</p>
            <button className="signup-link-btn" onClick={() => navigate("/login")}>
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;