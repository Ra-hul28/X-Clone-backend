import { useState } from "react";
import api from "../api/axios";
import "./EditProfileModal.css";

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    username: user.username || "",
    email: user.email || "",
    bio: user.bio || "",
    link: user.link || "",
    newPassword: "",
    currentPassword: "",
  });

  const [profileImg, setProfileImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, setImg) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/update", {
        ...formData,
        profileImg,
        coverImg,
      });
      onUpdate(res.data);
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-modal">
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <button type="button" onClick={onClose}>✕</button>
            <h3>Edit Profile</h3>
            <button type="submit" className="save-btn">Save</button>
          </div>

          <div className="edit-images">
            <div className="edit-cover">
              <img src={coverImg || user.coverImg || ""} alt="cover" />
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setCoverImg)} />
            </div>
            <div className="edit-avatar">
              <img src={profileImg || user.profileImg || "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"} alt="avatar" />
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setProfileImg)} />
            </div>
          </div>

          <div className="edit-inputs">
            <input name="fullName" placeholder="Name" value={formData.fullName} onChange={handleInputChange} />
            <textarea name="bio" placeholder="Bio" value={formData.bio} onChange={handleInputChange} />
            <input name="link" placeholder="Location/Link" value={formData.link} onChange={handleInputChange} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;