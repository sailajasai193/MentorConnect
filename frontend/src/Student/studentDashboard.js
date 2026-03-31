import { useState, useEffect } from "react";
import StudentNavbar from "../Components/StudentNavbar";
import "./studentDashboard.css";

const domainToCollege = {
  "@iitb.ac.in": "IIT Bombay",
  "@iitd.ac.in": "IIT Delhi",
  "@iitk.ac.in": "IIT Kanpur",
  "@iitm.ac.in": "IIT Madras",
  "@iitkgp.ac.in": "IIT Kharagpur",
  "@iitg.ac.in": "IIT Guwahati",
  "@iitroorkee.ac.in": "IIT Roorkee",
  "@iitdh.ac.in": "IIT Dharwad",
  "@iitbhilai.ac.in": "IIT Bhilai",
  "@iitgoa.ac.in": "IIT Goa",
  "@iitj.ac.in": "IIT Jodhpur",
  "@iitmandi.ac.in": "IIT Mandi",
  "@iitrpr.ac.in": "IIT Ropar",
  "@iitp.ac.in": "IIT Patna",
  "@iitbbs.ac.in": "IIT Bhubaneswar",
  "@iitism.ac.in": "IIT (ISM) Dhanbad",
  "@iitgn.ac.in": "IIT Gandhinagar",
  "@iitpkd.ac.in": "IIT Palakkad",
  "@iittp.ac.in": "IIT Tirupati",
  "@iiti.ac.in": "IIT Indore",
  "@iitpalakkad.ac.in": "IIT Palakkad"
};

function getCollegeFromEmail(email) {
  for (const domain in domainToCollege) {
    if (email.endsWith(domain)) return domainToCollege[domain];
  }
  return "Unknown College";
}

function StudentDashboard() {
  const [mentorsArray, setMentorsArray] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/slots/allmentors", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();

        // Group slots by mentor
        const mentorsMap = {};
        data.forEach(slot => {
          const mId = slot.mentor._id;
          if (!mentorsMap[mId]) mentorsMap[mId] = { mentor: slot.mentor, slots: [] };
          mentorsMap[mId].slots.push(slot);
        });

        setMentorsArray(Object.values(mentorsMap));
      } catch (err) {
        console.error("Failed to fetch mentors:", err);
      }
    };

    fetchMentors();
  }, [token]);

  const handleMeeting = async (slotId) => {
    const confirmBooking = window.confirm("Do you want to confirm booking this slot?");
    if (!confirmBooking) return;

    try {
      const res = await fetch(`http://localhost:5000/api/slots/book/${slotId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        alert("Slot booked successfully! Meeting created and emails sent.");
        setBookedSlots((prev) => [...prev, slotId]);
      } else {
        alert(data.message || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="st-container">
      <StudentNavbar />
      <div className="st-min-container">
        {mentorsArray.length === 0 ? (
          <p>No available mentors or slots at the moment.</p>
        ) : (
          mentorsArray.map(({ mentor, slots }) => (
            <div key={mentor._id} className="mentor-card">
              <h3>{mentor.name}</h3>
              <p><strong>Email:</strong> {mentor.email}</p>
              <p><strong>College:</strong> {mentor.college || getCollegeFromEmail(mentor.email)}</p>
              <p><strong>Headline:</strong> {mentor.headline}</p>
              <p><strong>About:</strong> {mentor.about}</p>
              <p><strong>Languages:</strong> {mentor.languages.length > 0 ? mentor.languages.join(", ") : "Not specified"}</p>
              <p><strong>Price per Session:</strong> ₹{mentor.pricePerSession}</p>
              <p><strong>LinkedIn:</strong> {mentor.linkedin ? <a href={mentor.linkedin} target="_blank" rel="noreferrer">{mentor.linkedin}</a> : "Not provided"}</p>

              <p><strong>Available Slots:</strong></p>
              {slots.map((slot) => (
                <div key={slot.slotId} className="slots-row">
                  <span className="slot-time">{slot.date} | {slot.startTime} - {slot.endTime}</span>
                  <button
                    className="book-btn-slot"
                    onClick={() => handleMeeting(slot.slotId)}
                    disabled={bookedSlots.includes(slot.slotId)}
                  >
                    {bookedSlots.includes(slot.slotId) ? "Booked" : "Book Slot"}
                  </button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;