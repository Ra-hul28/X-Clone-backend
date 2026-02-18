import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import "./Feed.css";

const Feed = () => {
  return (
    <div className="feed">
      <div className="feed-tabs">
        <button className="active">For you</button>
        <button>Following</button>
      </div>

      <CreatePost />

      <PostCard />
      <PostCard />
      <PostCard />
    </div>
  );
};

export default Feed;
