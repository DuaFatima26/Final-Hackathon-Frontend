import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProfileForm = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [github, setGithub] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing profile when page loads
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const token = await user.getIdToken();
      const res = await fetch("https://final-hackathon-backend-seven.vercel.app/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  // Save or update profile
  const saveProfile = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    setLoading(true);
    const token = await user.getIdToken();

    const res = await fetch("https://final-hackathon-backend-seven.vercel.app/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        email: user.email,
        skills: skills.split(",").map(s => s.trim()),
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
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Create / Update Profile</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        placeholder="Skills (comma separated)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        placeholder="GitHub Link"
        value={github}
        onChange={(e) => setGithub(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button onClick={saveProfile} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default ProfileForm;
