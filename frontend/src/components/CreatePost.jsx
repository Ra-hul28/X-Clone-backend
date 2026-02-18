import { useState } from "react";
import api from "../api/axios";
import "./CreatePost.css";

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !img) return;

    try {
      setLoading(true);
      // Sending JSON to match backend post.controller.js
      const res = await api.post("/posts/create", { text, img });
      
      onPostCreated(res.data);
      setText("");
      setImg(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Post failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <div className="post-avatar">
        <img src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png" alt="avatar" />
      </div>
      <div className="post-body">
        <textarea
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="post-image-preview">
            <img src={img} alt="preview" />
            <button className="remove-img" onClick={() => setImg(null)}>X</button>
          </div>
        )}
        <div className="post-actions">
          <label className="image-upload">
            📷 <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </label>
          <button onClick={handleSubmit} disabled={loading || (!text.trim() && !img)}>
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;