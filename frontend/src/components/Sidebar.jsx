import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "./Sidebar.css";

const Sidebar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo-container" onClick={() => navigate("/")}>
          <span className="logo-x">𝕏</span>
        </div>

        <nav className="menu">
          <Link to="/" className="menu-item active">
            <span className="icon">🏠</span> <span className="label">Home</span>
          </Link>
          <Link to="/notifications" className="menu-item">
            <span className="icon">🔔</span> <span className="label">Notifications</span>
          </Link>
          <Link to={`/profile/${user?.username}`} className="menu-item">
            <span className="icon">👤</span> <span className="label">Profile</span>
          </Link>
        </nav>

        <button className="post-btn-large">Post</button>
      </div>

      {user && (
        <div className="user-profile-toggle" onClick={handleLogout}>
          <div className="user-info-mini">
            <img 
              src={user.profileImg || "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"} 
              alt="avatar" 
            />
            <div className="user-details">
              <p className="full-name">{user.fullName}</p>
              <p className="username">@{user.username}</p>
            </div>
          </div>
          <span className="logout-icon">⏻</span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
