import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./PostCard.css";

const PostCard = ({ post, onPostDeleted }) => {
  const { user: authUser } = useAuth();

  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);

  const isLiked = likes.includes(authUser?._id);
  const isMyPost = authUser?._id === post.user?._id;

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      await api.post(`/posts/like/${post._id}`);
      if (isLiked) {
        setLikes(likes.filter((id) => id !== authUser._id));
      } else {
        setLikes([...likes, authUser._id]);
      }
    } catch (err) {
      console.error("Error liking post", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await api.post(`/posts/comment/${post._id}`, { text: commentText });
      setComments(res.data.comments); 
      setCommentText("");
      setIsCommenting(false);
    } catch (err) {
      console.error("Error adding comment", err);
      alert("Failed to post comment");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${post._id}`);
      if (onPostDeleted) onPostDeleted(post._id);
    } catch (err) {
      console.error("Error deleting post", err);
      alert("Failed to delete post");
    }
  };

  // --- NEW: COPY LINK FUNCTION (No backend needed) ---
  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/profile/${post.user?.username}`; // Or a specific post route if you have one
    navigator.clipboard.writeText(postUrl);
    alert("Profile link copied to clipboard!");
  };

  return (
    <div className="post-card">
      <Link to={`/profile/${post.user?.username}`} className="post-avatar">
        <img
          src={post.user?.profileImg || "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"}
          alt="avatar"
        />
      </Link>

      <div className="post-content">
        <div className="post-header">
          <Link to={`/profile/${post.user?.username}`} className="post-name">
            {post.user?.fullName}
          </Link>
          <span className="post-username">@{post.user?.username}</span>
          <span className="post-dot">·</span>
          <span className="post-time">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className="post-text">{post.text}</p>

        {post.img && (
          <div className="post-image">
            <img src={post.img} alt="post" />
          </div>
        )}

        {/* UPDATED ACTION BUTTONS */}
        <div className="post-actions">
          {/* 1. COMMENT */}
          <div className="action-item" onClick={() => setIsCommenting(!isCommenting)}>
            <span>💬</span> {comments.length}
          </div>

          {/* 2. DELETE (Only if it's your post, replaces Repost) */}
          <div className={`action-item ${isMyPost ? "delete-active" : "disabled"}`} onClick={isMyPost ? handleDelete : null}>
             <span title={isMyPost ? "Delete" : "Only authors can delete"}>{isMyPost ? "🗑️" : "🔒"}</span>
          </div>

          {/* 3. LIKE */}
          <div className={`action-item ${isLiked ? "liked" : ""}`} onClick={handleLike}>
            <span>{isLiked ? "❤️" : "🖤"}</span> {likes.length}
          </div>

          {/* 4. SHARE (Replaces Analytics) */}
          <div className="action-item" onClick={handleCopyLink}>
            <span title="Copy Link">🔗</span>
          </div>
        </div>

        {/* COMMENT INPUT SECTION */}
        {isCommenting && (
          <div className="comment-input-wrapper">
            <form onSubmit={handleComment} className="comment-form">
              <input
                type="text"
                placeholder="Post your reply"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                autoFocus
              />
              <button type="submit" className="reply-btn" disabled={!commentText.trim()}>
                Reply
              </button>
            </form>
          </div>
        )}

        {/* COMMENTS DISPLAY SECTION */}
        {comments.length > 0 && (
          <div className="comments-display-section">
            {comments.slice(0, 3).map((comment, index) => ( // Showing only top 3
              <div key={index} className="comment-item">
                <img 
                  src={comment.user?.profileImg || "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"} 
                  className="comment-avatar" 
                  alt="user" 
                />
                <div className="comment-item-content">
                  <div className="comment-user-info">
                    {comment.user?.fullName} 
                    <span className="comment-username">@{comment.user?.username}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard; 