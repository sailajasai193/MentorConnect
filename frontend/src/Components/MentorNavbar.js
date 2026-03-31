import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./MentorNavbar.css";

function MentorNavbar() {

  const navigate = useNavigate();
  const location = useLocation();
   const [username,setUsername] = useState("");

   useEffect(()=>{
    const name = localStorage.getItem("username");
    setUsername(name);
   },[])

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
   
  const handleback = () => navigate("/mentor");

  return (
    <div className="mentor-header">
           <h4 style={{textAlign:"center",color:"black"}}>
          Welcome! 
        </h4>
      <div className="seller-header-nav">
        
        <button onClick={() => navigate("/upcmg")} disabled={location.pathname === "/upcmg"}> Upcoming Sessions </button>
        <button onClick={() => navigate("/cmp")} disabled={location.pathname === "/cmp"}> Completed Sessions </button>
        <button onClick={() => navigate("/session")} disabled={location.pathname === "/session"}> Session History</button>
       <button onClick={() => navigate("/upload")} disabled={location.pathname === "/upload"} >Upload Recording</button>
        <button onClick={() => navigate("/mentor/availability")} disabled={location.pathname === "/mentor/availability"} >  Availability Slots</button>


      </div>
      <div className="mentor-header-right">
        <button className="mentor-header-btn" onClick={handleback}> &lt; Go Back</button>
        <button className="mentor-header-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
    
  );
}

export default MentorNavbar;