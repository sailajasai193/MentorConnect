import { useState, useEffect } from "react";
import MentorNavbar from "../Components/MentorNavbar";
import "./Availability.css";
import Footer from "../Components/footer";

function Availability(){

  const [slots,setSlots] = useState([]);

  const [date,setDate] = useState("");
  const [start,setStart] = useState("");
  const [end,setEnd] = useState("");

  const token = localStorage.getItem("token");

  
  useEffect(() => {
  fetch("http://localhost:5000/api/slots/all",{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    if(Array.isArray(data)){
      setSlots(data);
    }else{
      setSlots([]);
    }
  })
  .catch(err => console.log(err));
},[token]);


  const addSlot = async () => {
    if(!date || !start || !end){
      alert("Please fill all fields");
      return;
    }

    try{
      const response = await fetch("http://localhost:5000/api/slots/add",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          date,
          startTime:start,
          endTime:end
        })
      });
      const data = await response.json();
      if(response.ok){
        setSlots([...slots,data.slot]);
        setDate("");
        setStart("");
        setEnd("");
      }
    }catch(err){
      console.log(err);
    }

  };


  const deleteSlot = async (slotId) => {
    try{
      const response = await fetch(`http://localhost:5000/api/slots/${slotId}`,{
        method:"DELETE",
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      if(response.ok){
        setSlots(slots.filter(slot => slot._id !== slotId));
      }
    }catch(err){
      console.log(err);
    }

  };


  return(
    <div className="avai-container">
      <MentorNavbar/>
      <div className="add-slot-container">
        <h2>Add Availability Slot</h2>
        <div className="add-slot-form">
          <div className="input-group">
            <label>Date</label>
            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}/>
          </div>
          <div className="input-group">
            <label>Start Time</label>
            <input
              type="time"
              value={start}
              onChange={(e)=>setStart(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>End Time</label>
            <input
              type="time"
              value={end}
              onChange={(e)=>setEnd(e.target.value)}
            />
          </div>

          <button className="add-slot-btn" onClick={addSlot}>
            Add Slot
          </button>

        </div>

      </div>


      <div className="available-slots">
        <h2 style={{color:"white"}}>Your Available Slots</h2>

        {slots.length === 0 ? (
          <p>No slots available</p>
        ):(
          slots.map((slot)=>(
            <div key={slot._id} className="slot-card">

              <div>
                <p><b>Date:</b> {slot.date}</p>
                <p><b>Time:</b> {slot.startTime} - {slot.endTime}</p>
              </div>

              <button
                className="delete-btn"
                onClick={()=>deleteSlot(slot._id)}>
                Delete
              </button>
            </div>
          ))
        )}

      </div>
       <Footer/>
    </div>
  );
}

export default Availability;