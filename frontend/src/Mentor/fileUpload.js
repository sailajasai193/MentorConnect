import { useState, useRef } from 'react';
import MentorNavbar from "../Components/MentorNavbar";
import "./fileup.css";
import Footer from "../Components/footer";

function AudioUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  // Ref for the file input
  const fileInputRef = useRef(null);

  const handleUpload = () => {
    if (!file) return alert("Please select a file!");
      

    setUploading(true);
    const token = localStorage.getItem("token"); 
    const formData = new FormData();
    formData.append('audio', file);
    formData.append("email", studentEmail); 


    fetch('http://localhost:5000/api/upload', {
      method: 'POST',
       headers: {
       Authorization: `Bearer ${token}`, 
      },
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        alert("Summary is being processed and will be delivered to your email within 5 minutes. Thank you.");

        // Reset state and clear input
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = null; // This clears the HTML input
        }
        setStudentEmail("");  

        setUploading(false);
      })
      .catch(err => {
        console.error("Upload failed:", err);
        setUploading(false);
      });
  };

  return (
    <div className="fileup-container">
      <MentorNavbar />
      <div className="fileup-min-container">
        <input type="text" placeholder="Enter Student Email"  value={studentEmail}
        onChange={(e) => setStudentEmail(e.target.value)} // update state
        style={{
          width: "235px",
          padding: "10px 15px",
          fontSize: "13px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          outline: "none",
          marginBottom: "10px"
        }}/>
        <input
          type="file"
          ref={fileInputRef}
          onChange={e => setFile(e.target.files[0])}
        />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload & Summarize"}
        </button>
      </div>
      <Footer/>
    </div>
  );
}

export default AudioUpload;