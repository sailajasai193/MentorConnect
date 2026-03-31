import { useNavigate, useLocation } from "react-router-dom";
import "./MentorNavbar.css";

function StudentNavbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleback = () => navigate(-1);
  return (
    <div className="mentor-header">
      <h4 style={{textAlign:"center",color:"black"}}>
          Welcome! 
        </h4>
      <div className="seller-header-nav">
         
        <button onClick={() => navigate("/st/mentor-list")} disabled={location.pathname === "/st/mentor-list"}> Mentors List </button>
        <button onClick={() => navigate("/st/upcomingmeetings")} disabled={location.pathname === "/st/upcomingmeetings"}> Upcoming Sessions </button>
        <button onClick={() => navigate("/st/completedsessions")} disabled={location.pathname === "/st/completedsessions"}> Completed Sessions</button>
         <button onClick={() => navigate("/st/sessionhistory")} disabled={location.pathname === "/st/sessionhistory"}>  Session history </button>
      </div>

      <div className="mentor-header-right">
        <button className="mentor-header-btn" onClick={handleback}> &lt; Go Back</button>
        <button className="mentor-header-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
    
  );
}

export default StudentNavbar;