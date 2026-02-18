import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import EditProfileModal from "../components/EditProfileModal";
import FollowListModal from "../components/FollowListModal";
import SuggestedUsers from "../components/SuggestedUsers";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { username } = useParams();
  const { user: authUser, setUser: setAuthUser } = useAuth();

  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedType, setFeedType] = useState("posts"); // "posts" or "likes"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [listModal, setListModal] = useState({ open: false, title: "", data: [] });

  const fetchProfileData = async () => {
    try {
      const userRes = await api.get(`/users/profile/${username}`);
      setUserProfile(userRes.data);

      // Fetch either user's posts or liked posts based on feedType
      const endpoint = feedType === "posts" 
        ? `/posts/user/${username}` 
        : `/posts/likes/${userRes.data._id}`;
      
      const postsRes = await api.get(endpoint);
      setPosts(postsRes.data);
    } catch (err) {
      console.error("Error fetching profile data:", err);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true);
      await fetchProfileData();
      setLoading(false);
    };
    initFetch();
  }, [username, feedType]); // Re-fetch when username or feedType changes

  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      const res = await api.post(`/users/follow/${userProfile._id}`);
      setAuthUser(res.data);
      await fetchProfileData();
    } catch (err) {
      console.error("Follow error:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!userProfile) return <div className="error">User not found</div>;

  const isMyProfile = authUser?.username === username;
  const amIFollowing = authUser?.following?.includes(userProfile?._id);

  return (
    <div className="profile-container">
      <div className="profile">
        <div className="profile-header-nav">
          <button className="back-btn" onClick={() => window.history.back()}>←</button>
          <div>
            <h2>{userProfile.fullName}</h2>
            <span>{posts.length} {feedType}</span>
          </div>
        </div>

        <div className="profile-cover">
          {userProfile.coverImg && <img src={userProfile.coverImg} alt="cover" />}
        </div>

        <div className="profile-details-section">
          <div className="profile-avatar-row">
            <img
              className="profile-avatar-large"
              src={userProfile.profileImg || "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"}
              alt="avatar"
            />
            {isMyProfile ? (
              <button className="edit-btn" onClick={() => setIsModalOpen(true)}>Edit profile</button>
            ) : (
              <button
                className={`follow-btn ${amIFollowing ? "unfollow" : ""}`}
                onClick={handleFollow}
                disabled={followLoading}
              >
                {followLoading ? "..." : amIFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>

          <div className="profile-info-text">
            <h2>{userProfile.fullName}</h2>
            <p className="username-handle">@{userProfile.username}</p>
            <p className="bio-text">{userProfile.bio || "No bio yet"}</p>
            <div className="profile-meta">
              <span>📅 Joined {new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="follow-counts">
              <span onClick={() => setListModal({ open: true, title: "Following", data: userProfile.following || [] })} style={{ cursor: "pointer" }}>
                <b>{userProfile.following?.length || 0}</b> Following
              </span>
              <span onClick={() => setListModal({ open: true, title: "Followers", data: userProfile.followers || [] })} style={{ cursor: "pointer" }}>
                <b>{userProfile.followers?.length || 0}</b> Followers
              </span>
            </div>
          </div>
        </div>

        {/* Updated Tabs with Functionality */}
        <div className="profile-tabs">
          <button 
            className={feedType === "posts" ? "active" : ""} 
            onClick={() => setFeedType("posts")}
          >
            Posts
          </button>
          <button 
            className={feedType === "likes" ? "active" : ""} 
            onClick={() => setFeedType("likes")}
          >
            Likes
          </button>
        </div>

        <div className="profile-feed">
          {posts.map(post => (
            <PostCard key={post._id} post={post} onPostDeleted={fetchProfileData} />
          ))}
          {posts.length === 0 && (
            <p className="no-posts">
              {feedType === "posts" ? "No posts yet." : "No liked posts yet."}
            </p>
          )}
        </div>
      </div>

      <div className="profile-right-sidebar">
        <SuggestedUsers />
      </div>

      {isModalOpen && (
        <EditProfileModal
          user={userProfile}
          onClose={() => setIsModalOpen(false)}
          onUpdate={fetchProfileData}
        />
      )}

      {listModal.open && (
        <FollowListModal
          title={listModal.title}
          users={listModal.data}
          onClose={() => setListModal({ ...listModal, open: false })}
          onUpdateProfile={fetchProfileData}
        />
      )}
    </div>
  );
};

export default Profile;