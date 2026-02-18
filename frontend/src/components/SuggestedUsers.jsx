import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./SuggestedUsers.css";

const SuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: authUser, setUser: setAuthUser } = useAuth();

  useEffect(() => {
    const getSuggested = async () => {
      try {
        const res = await api.get("/users/suggested");
        setSuggestedUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getSuggested();
  }, []);

  const handleFollow = async (userId) => {
  try {
    const res = await api.post(`/users/follow/${userId}`);
    
    // res.data is now the full updated user object from the backend
    setAuthUser(res.data);
    
    // Remove the user from suggestions UI
    setSuggestedUsers(prev => prev.filter(u => u._id !== userId));
  } catch (err) {
    console.error("Follow failed", err);
  }
};

  if (loading) return null;

  return (
    <div className="suggested-container">
      <h3>Who to follow</h3>
      {suggestedUsers.map((user) => (
        <div key={user._id} className="suggested-item">
          <Link to={`/profile/${user.username}`} className="suggested-info">
            <img src={user.profileImg || "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"} alt="avatar" />
            <div className="suggested-names">
              <span className="full-name">{user.fullName}</span>
              <span className="username">@{user.username}</span>
            </div>
          </Link>
          <button className="follow-btn-sm" onClick={() => handleFollow(user._id)}>Follow</button>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUsers;