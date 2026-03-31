import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import VerifyOtp from "./VerifyOtp";
import MentorDashboard from "./Mentor/MentorDashboard";
import Availability from "./Mentor/Availability";
import StudentDashboard from "./Student/studentDashboard";
import AudioUpload from "./Mentor/fileUpload";
import MentorSetupProfile from "./Mentor/SetupProfile";
import Upcoming from "./Mentor/upcoming";
import Completed from "./Mentor/completed";
import Session from "./Mentor/session";
import StUpcoming from "./Student/stUpcoming";
import STCompleted from "./Student/stCompleted";
import StSession from "./Student/stSessionhistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp/>}/>
        <Route path="/mentor" element={<MentorDashboard/>}/>
        <Route path="/mentor/availability" element={<Availability/>} />
        <Route path="/st/mentor-list" element={<StudentDashboard/>}/>
        <Route path="/upload" element={<AudioUpload/>}/>
        <Route path="/setup" element={<MentorSetupProfile/>}/>
        <Route path="/upcmg" element={<Upcoming/>}/>
        <Route path="/cmp" element={<Completed/>}/>
        <Route path="/session" element={<Session/>}/>
        <Route path="/st/upcomingmeetings" element={<StUpcoming/>}/>
        <Route path="/st/completedsessions" element={<STCompleted/>}/>
        <Route path="/st/sessionhistory" element={<StSession/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
