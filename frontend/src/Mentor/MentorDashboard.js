import { useState, useEffect } from "react";
import MentorNavbar from "../Components/MentorNavbar";
import "./Mentordash.css";
import Footer from "../Components/footer";

function MentorDashboard(){

  const [username,setUsername] = useState("");
  const [items,setItems] = useState([]); 
   const token = localStorage.getItem("token");
   useEffect(() => {
    fetch("http://localhost:5000/api/today/session", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.log(err));
  }, []);

  const [stats,setStats] = useState({
    total:0,
    week:0,
    completed:0
  });

  useEffect(() => {
  const name = localStorage.getItem("username");
  setUsername(name);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/today/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();

      setStats({
        total: data.totalSessions,
        week: data.sessionsThisWeek,
        completed: data.completedSessions
      });

    } catch (err) {
      console.error(err);
    }
  };

  fetchStats();
}, []);




  return (

    <div className="mentor-container">

      {}
      <MentorNavbar />
      <div className="mentor-body">
           <div style={{ textAlign: "center", marginTop: "40px" }}>
    <h2 style={{
    fontSize: "38px",
    fontWeight: "800",
    background: "linear-gradient(90deg, #4a6cf7, #70a1ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
    color:"white"
  }}>
    Welcome to MentorConnect
  </h2>

    <p style={{
      fontSize: "18px",
      color: "#555"
    }}>
      Connect. Learn. Grow with expert mentors.
    </p>
   </div>

        {}

        <div className="mentor-today-sessions">
          <h3>Today's Sessions</h3>
          {items.length === 0 ? (
            <p>No sessions today</p>
          ):(
            items.map((item, index) => (
            <div key={index} className="session-card">
              <p>Student: {item.student.name}</p>
              <p>Time: {item.startTime} - {item.endTime}</p>
              <p>
            Meeting Link:{" "}
            {item.meetingLink ? (
              <a href={item.meetingLink} target="_blank" rel="noopener noreferrer">
                {item.meetingLink} {/* shows full URL */}
              </a>
            ) : (
              "Not available"
            )}
          </p>
            </div>
          ))
          )}

        </div>
        {}
        <div className="mentor-totalview">
          <div className="stat-box">
            <h4>Total sessions</h4>
            <p>Total count of all mentoring sessions, covering completed, ongoing, and scheduled sessions.</p>
            <h3>{stats.total}</h3>
          </div>
          <div className="stat-box">
            <h4>Completed sessions</h4>
            <p>Sessions that have been successfully completed.</p>
            <h3>{stats.completed}</h3>
          </div>
          <div className="stat-box">
            <h4>Sessions this week</h4>
            <p>Sessions scheduled or completed during the current week</p>
            <h3>{stats.week}</h3>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
    
  );
}

export default MentorDashboard;