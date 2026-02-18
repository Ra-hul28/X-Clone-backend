import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./FollowListModal.css";

const FollowListModal = ({ title, users, onClose, onUpdateProfile }) => {
  const { user: authUser, setUser: setAuthUser } = useAuth();

  const handleUnfollow = async (e, userId) => {
    e.preventDefault(); // Stop the Link navigation
    e.stopPropagation(); // Stop event bubbling
    try {
      const res = await api.post(`/users/follow/${userId}`);
      
      // Update global auth user to keep the session alive and update global state
      setAuthUser(res.data);
      
      // Call the refresh function passed from Profile.jsx to update the counts in the background
      if (onUpdateProfile) {
        onUpdateProfile();
      }
    } catch (err) {
      console.error("Failed to unfollow:", err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="follow-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-list">
          {users.length === 0 && <p className="no-data">No users found.</p>}
          {users.map((user) => {
            const isFollowing = authUser?.following?.includes(user._id);
            const isMe = authUser?._id === user._id;

            return (
              <div key={user._id} className="user-list-row">
                <Link to={`/profile/${user.username}`} className="user-list-item" onClick={onClose}>
                  <img src={user.profileImg || "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"} alt="avatar" />
                  <div className="user-list-info">
                    <p className="full-name">{user.fullName}</p>
                    <p className="username">@{user.username}</p>
                  </div>
                </Link>
                
                {!isMe && isFollowing && title === "Following" && (
                  <button 
                    className="modal-unfollow-btn" 
                    onClick={(e) => handleUnfollow(e, user._id)}
                  >
                    Unfollow
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;