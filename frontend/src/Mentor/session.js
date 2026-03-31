import { useState, useEffect } from "react";
import axios from "axios";
import MentorNavbar from "../Components/MentorNavbar";
import Footer from "../Components/footer";
import "./session.css";

function Session() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/slots/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setSessions(res.data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  return (
    <div className="session-container">
  <MentorNavbar />

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


export default Session;