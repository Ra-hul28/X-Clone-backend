import { useState } from "react";
import api from "../api/axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { username, password });
      setUser(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <span className="big-x-logo">𝕏</span>
      </div>
      
      <div className="login-right">
        <div className="login-box">
          <h1 className="lets-go">Let's go.</h1>
          
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="input-icon">⌨️</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span 
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button className="login-btn" type="submit">Login</button>
          </form>

          <div className="login-footer">
            <p>Don't have an account?</p>
            <button className="signup-link-btn" onClick={() => navigate("/signup")}>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;