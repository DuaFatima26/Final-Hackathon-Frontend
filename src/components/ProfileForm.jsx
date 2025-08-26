import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./ProfileForm.css"; 

const ProfileForm = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [github, setGithub] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setName(data.name || "");
          setSkills(data.skills?.join(", ") || "");
          setGithub(data.github || "");
        }
      }
    };
    fetchProfile();
  }, [user]);

  // Save profile
  const saveProfile = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }
    setLoading(true);
    const token = await user.getIdToken();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        email: user.email,
        skills: skills.split(",").map((s) => s.trim()),
        github,
      }),
    });
    setLoading(false);
    if (res.ok) {
      alert("Profile saved successfully!");
    } else {
      const error = await res.json();
      alert(`Error: ${error.error}`);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header>
        <h1>
          <i className="fas fa-rocket"></i> Professional Portfolio Builder
        </h1>
        <p>Create your stunning portfolio in minutes - No coding required!</p>
      </header>

      <div className="main-content">
        {/* Left: Form */}
        <div className="form-container">
          <h2 className="form-title">Enter Your Details</h2>

          <div className="input-group">
            <label>
              <i className="fas fa-user"></i> Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Ali Ahmed"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>
              <i className="fas fa-code"></i> Skills
            </label>
            <input
              type="text"
              placeholder="HTML, CSS, JS"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <span className="input-hint">Separate skills with commas</span>
          </div>

          <div className="input-group">
            <label>
              <i className="fab fa-github"></i> GitHub Link
            </label>
            <input
              type="url"
              placeholder="https://github.com/username"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
          </div>

          <button onClick={saveProfile} className="btn" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>

        {/* Right: Preview */}
        <div className="preview-container">
          <h2 className="preview-title">Live Preview</h2>
          <div className="portfolio-preview">
            <div className="profile-header">
              <div className="avatar">
                <i className="fas fa-user"></i>
              </div>
              <h2 className="profile-name">{name || "Your Name"}</h2>
              <p className="profile-username">
                @{user?.email?.split("@")[0] || "username"}
              </p>
              <p className="profile-contact">
                <i className="fas fa-envelope"></i> {user?.email}
              </p>
              {github && (
                <a
                  href={github}
                  className="profile-github"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fab fa-github"></i> GitHub Profile
                </a>
              )}
            </div>

            <div className="profile-section">
              <h3>
                <i className="fas fa-code"></i> Skills
              </h3>
              <div className="skills-container">
                {skills
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s)
                  .map((s, i) => (
                    <span key={i} className="skill">
                      {s}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <p>
          © 2025 Professional Portfolio Builder | Create your amazing portfolio
          with ease
        </p>
      </footer>
    </div>
  );
};

export default ProfileForm;
