import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { jsPDF } from "jspdf"; // ✅ import jspdf
import "./ProfileForm.css";

const ProfileForm = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.displayName || "");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [github, setGithub] = useState("");
  const [skills, setSkills] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Beautiful Styled PDF
  const generatePDF = () => {
    const confirmDownload = window.confirm(
      "Do you want to download your Portfolio as PDF?"
    );
    if (!confirmDownload) return;

    const doc = new jsPDF();

    // ===== HEADER =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(33, 37, 41); // dark color
    doc.text("Professional Portfolio", 105, 25, { align: "center" });

    // line under heading
    doc.setDrawColor(67, 97, 238);
    doc.setLineWidth(1);
    doc.line(20, 30, 190, 30);

    // ===== PERSONAL INFO =====
    doc.setFontSize(16);
    doc.setTextColor(58, 12, 163);
    doc.text("Personal Information", 20, 45);

    doc.setFontSize(12);
    doc.setTextColor(33, 37, 41);
    doc.text(`Full Name: ${name || "N/A"}`, 25, 55);
    doc.text(`Username: @${username || "N/A"}`, 25, 65);
    doc.text(`Email: ${email || "N/A"}`, 25, 75);
    doc.text(`GitHub: ${github || "N/A"}`, 25, 85);

    // ===== ABOUT ME =====
    doc.setFontSize(16);
    doc.setTextColor(58, 12, 163);
    doc.text("About Me", 20, 105);

    doc.setFontSize(12);
    doc.setTextColor(33, 37, 41);
    doc.text(about || "No about info provided.", 25, 115, { maxWidth: 160 });

    // ===== SKILLS =====
    doc.setFontSize(16);
    doc.setTextColor(58, 12, 163);
    doc.text("Skills", 20, 145);

    doc.setFontSize(12);
    doc.setTextColor(33, 37, 41);
    const skillsArr = skills ? skills.split(",") : ["HTML", "CSS", "JavaScript"];
    skillsArr.forEach((s, i) => {
      doc.text(`• ${s.trim()}`, 25, 155 + i * 10);
    });

    // ===== FOOTER =====
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      "Generated with Professional Portfolio Builder  2025",
      105,
      290,
      { align: "center" }
    );

    // save file
    doc.save("portfolio.pdf");
  };

  // save profile to backend
  const saveProfile = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    setLoading(true);
    const token = await user.getIdToken();
    console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        email,
        username,
        about,
        skills: skills.split(",").map((s) => s.trim()),
        github,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Profile saved successfully!");
      generatePDF(); // ✅ PDF download trigger
    } else {
      const error = await res.json();
      alert(`Error: ${error.error}`);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>
          <i className="fas fa-rocket"></i> Professional Portfolio Builder
        </h1>
        <p>Create your stunning portfolio in minutes - No coding required!</p>
      </header>

      <div className="main-content">
        {/* Left Side Form */}
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
              <i className="fas fa-at"></i> Username
            </label>
            <input
              type="text"
              placeholder="e.g. aliahmed"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>
              <i className="fas fa-envelope"></i> Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. ali@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>
              <i className="fab fa-github"></i> GitHub Profile URL
            </label>
            <input
              type="url"
              placeholder="e.g. https://github.com/username"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>
              <i className="fas fa-info-circle"></i> About Me
            </label>
            <textarea
              placeholder="Write something about yourself..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            ></textarea>
          </div>

          <div className="input-group">
            <label>
              <i className="fas fa-code"></i> Skills
            </label>
            <input
              type="text"
              placeholder="e.g. HTML, CSS, JavaScript, React"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <span className="input-hint">Separate skills with commas</span>
          </div>

          <button className="btn" onClick={saveProfile} disabled={loading}>
            <i className="fas fa-magic"></i>{" "}
            {loading ? "Saving..." : "Generate Portfolio"}
          </button>
        </div>

        {/* Right Side Preview */}
        <div className="preview-container">
          <h2 className="preview-title">Live Preview</h2>
          <div className="portfolio-preview">
            <div className="profile-header">
              <div className="avatar">
                <i className="fas fa-user"></i>
              </div>
              <h2 className="profile-name">{name || "Your Name"}</h2>
              <p className="profile-username">@{username || "username"}</p>
              <p className="profile-contact">
                <i className="fas fa-envelope"></i>{" "}
                {email || "email@example.com"}
              </p>
              <a
                href={github || "#"}
                className="profile-github"
                target="_blank"
              >
                <i className="fab fa-github"></i> GitHub Profile
              </a>
            </div>

            <div className="profile-section">
              <h3>
                <i className="fas fa-user-circle"></i> About Me
              </h3>
              <p>{about || "Tell us a little about yourself..."}</p>
            </div>

            <div className="profile-section">
              <h3>
                <i className="fas fa-code"></i> Skills
              </h3>
              <div className="skills-container">
                {(skills ? skills.split(",") : ["HTML", "CSS", "JavaScript"]).map(
                  (skill, i) => (
                    <span key={i} className="skill">
                      {skill.trim()}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <p>
          © 2023 Professional Portfolio Builder | Create your amazing portfolio
          with ease
        </p>
      </footer>
    </div>
  );
};

export default ProfileForm;
