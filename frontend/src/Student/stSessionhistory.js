import { useState, useEffect } from "react";
import StudentNavbar from "../Components/StudentNavbar";
import Footer from "../Components/footer";
import "./session.css";


function StSession() {
  const [sessions, setSessions] = useState([]);

  const token = localStorage.getItem("token");
  useEffect(() => {
  fetch("http://localhost:5000/api/student/st/sessionhistory", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch session history");
      return res.json();
    })
    .then((data) => {
      if (Array.isArray(data)) setSessions(data);
      else setSessions([]);
    })
    .catch((err) => console.log("Error fetching session history:", err));
}, [token]);

  return (
    <div className="session-container">
  <StudentNavbar />

  <div className="session-min-container">
    <h2>Session History</h2>

    {sessions.length === 0 ? (
      <p style={{ textAlign: "center" }}>No session history found</p>
    ) : (
      sessions.map((session) => (
        <div key={session._id} className="session-card">

          <p><strong>Student Name:</strong> {session.studentName}</p>
          <p><strong>Student Email:</strong> {session.studentEmail}</p>
          <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString("en-GB")}</p>
          <p><strong>Summary:</strong> {session.summary}</p>

        </div>
      ))
    )}
  </div>
  <Footer/>
</div>
  );
}


export default StSession;