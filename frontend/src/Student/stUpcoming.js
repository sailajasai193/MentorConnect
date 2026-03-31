import { useState, useEffect } from "react";
import StudentNavbar from "../Components/StudentNavbar";
import "./upcoming.css";
import Footer from "../Components/footer";


function StUpcoming() {
  const [sessions, setSessions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/student/st/upcoming", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch sessions");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setSessions(data);
        else setSessions([]);
      })
      .catch((err) => console.log(err));
  }, [token]);

   return (
    <div className="up-container">
      <StudentNavbar />

      <div className="up-min-container">
        <h2>Upcoming Sessions</h2>

        {sessions.length === 0 ? (
          <p>No upcoming sessions</p>
        ) : (
          sessions.map((session) => (
            <div key={session._id} className="session-card">
              <p><strong>Mentor:</strong> {session.mentor.name}</p>
              <p><strong>Email:</strong> {session.mentor.email}</p>
              <p><strong>Date:</strong> {session.date}</p>
              <p>
                <strong>Start Time:</strong> {session.startTime}
              </p>
              <p>
                <strong>End Time:</strong> {session.endTime}
              </p>
              
              <p><strong>Status:</strong> Booked</p>
               {session.meetingLink && (
            <p>
              <strong>Meeting Link:</strong>{" "}
              <a
                href={session.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Meeting
              </a>
            </p>
          )}
            </div>
          ))
        )}
      </div>
      <Footer/>
    </div>
  );

}

export default StUpcoming;