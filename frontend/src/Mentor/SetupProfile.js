import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SetupProfile.css";

function MentorSetupProfile() {
  const navigate = useNavigate();

  const [mentorData, setMentorData] = useState({
    headline: "",
    college: "",
    skills: "",
    languages: "",
    about: "",
    linkedin: "",
    pricePerSession: ""
  });

  // Handle text inputs
  const handleChange = (e) => {
    setMentorData({ ...mentorData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     const token = localStorage.getItem("token");
    // Convert comma-separated skills/languages to arrays
    const payload = {
      ...mentorData,
      skills: mentorData.skills.split(",").map((s) => s.trim()),
      languages: mentorData.languages.split(",").map((l) => l.trim())
    };

    const email = localStorage.getItem("otpEmail"); // optional if backend needs it

    const response = await fetch("http://localhost:5000/api/mentor/profile", {
      method: "POST",
       headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ ...payload, email })
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
      navigate("/mentor"); // after profile creation
    }
  };

  return (
  <div className="mentor-setup-container">
    <h2>Complete Your Mentor Profile</h2>
    <form onSubmit={handleSubmit}>
      
      <h4>Headline</h4>
      <input
        type="text"
        name="headline"
        placeholder="Final Year CSE Student @ XYZ College"
        value={mentorData.headline}
        onChange={handleChange}
        required
      />

      <h4>College / Company</h4>
      <input
        type="text"
        name="college"
        placeholder="XYZ College or Company Name"
        value={mentorData.college}
        onChange={handleChange}
      />

      <h4>Skills</h4>
      <input
        type="text"
        name="skills"
        placeholder="Java, DSA, React"
        value={mentorData.skills}
        onChange={handleChange}
        required
      />

      <h4>Languages Known</h4>
      <input
        type="text"
        name="languages"
        placeholder="English, Hindi, Telugu"
        value={mentorData.languages}
        onChange={handleChange}
      />

      <h4>About</h4>
      <textarea
        name="about"
        placeholder="A short 2-4 line description about yourself"
        value={mentorData.about}
        onChange={handleChange}
        required
      />

      <h4>LinkedIn (optional)</h4>
      <input
        type="text"
        name="linkedin"
        placeholder="https://linkedin.com/in/yourprofile"
        value={mentorData.linkedin}
        onChange={handleChange}
      />

      <h4>Price per session</h4>
      <input
        type="number"
        name="pricePerSession"
        placeholder="Enter price in INR"
        value={mentorData.pricePerSession}
        onChange={handleChange}
        required
      />

      <button type="submit">Save Profile</button>
    </form>
  </div>
);
}

export default MentorSetupProfile;