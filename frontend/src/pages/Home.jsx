import { useEffect, useState } from "react";
import api from "../api/axios";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import "./Home.css"; // Ensure you create this for tab styling

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedType, setFeedType] = useState("forYou");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const endpoint = feedType === "forYou" ? "/posts/all" : "/posts/following";
        const res = await api.get(endpoint);
        setPosts(res.data);
      } catch (err) {
        console.error(err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [feedType]);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(p => p._id !== postId));
  };

  return (
    <div className="home">
      {/* Feed Tabs */}
      <div className="home-tabs">
        <div 
          className={`tab ${feedType === "forYou" ? "active" : ""}`} 
          onClick={() => setFeedType("forYou")}
        >
          For you
        </div>
        <div 
          className={`tab ${feedType === "following" ? "active" : ""}`} 
          onClick={() => setFeedType("following")}
        >
          Following
        </div>
      </div>

      <CreatePost onPostCreated={handlePostCreated} />

      {loading ? (
        <p style={{ padding: "20px" }}>Loading...</p>
      ) : (
        <div className="feed">
          {posts.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              onPostDeleted={handlePostDeleted} 
            />
          ))}
          {posts.length === 0 && (
            <p style={{ textAlign: "center", padding: "40px", color: "#71767b" }}>
              No posts to show. Start following people!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;



