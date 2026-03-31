import { useState, useEffect } from "react";
import MentorNavbar from "../Components/MentorNavbar";
import "./upcoming.css";
import Footer from "../Components/footer";


function Upcoming() {
  const [sessions, setSessions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/slots/upcoming", {
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
      <MentorNavbar />

      <div className="up-min-container">
        <h2>Upcoming Sessions</h2>

        {sessions.length === 0 ? (
          <p>No upcoming sessions</p>
        ) : (
          sessions.map((session) => (
            <div key={session._id} className="session-card">
              <p><strong>Student:</strong> {session.student?.name}</p>
              <p><strong>Email:</strong> {session.student?.email}</p>
              <p><strong>Date:</strong> {session.date}</p>
              <p>
                <strong>Start Time:</strong> {session.startTime}
              </p>
              <p>
                <strong>End Time:</strong> {session.endTime}
              </p>
              <p><strong>Status:</strong> Booked</p>
            </div>
          ))
        )}
      </div>
      <Footer/>
    </div>
  );

}

export default Upcoming;