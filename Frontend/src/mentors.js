import React, { useEffect, useState,useRef } from 'react';
import './mentors.css';
import axios from 'axios';
import photo1 from './assets/i1.jpg';
import photo2 from './assets/i2.jpg';
import photo3 from './assets/i3.jpg';
import photo4 from './assets/i4.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Mentors() {
  const [users, setUsers] = useState([]);
  const images = [photo1, photo2,photo3,photo4];
   
  useEffect(() => {
    axios('http://localhost:5000/getmentors')
      .then(res => { 
        setUsers(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  function connectwithmentor(mentorname){
  const useremail = localStorage.getItem("userEmail");
  
  axios.post('http://localhost:5000/sendemail', { email: useremail , name: mentorname})
    .then(res => {
      console.log(res.data);
      alert("Email sent successfully!please check your email.");
    })
    .catch(err => {
      console.error(err);
      alert("Failed to send email");
    });
}
    const [query,setquery]=useState('')
   const filteruser = users.filter((user) => user.College.includes('IIT Dharwad'));
    console.log(filteruser);

  return (
    
    <div className='main'>
        <div className="mentors-heading">
           <input type="text" placeholder="Search here" className="mentorsearch" onChange={(e)=>setquery(e.target.value)}/><br />
        <h1> Our Expert Mentors</h1>
        <p>Learn from Students who have mastered their fields</p>
      </div>
     {users.filter((user) =>
  user.College.toLowerCase().includes(query.toLowerCase()) ||
  user.name.toLowerCase().includes(query.toLowerCase()) ||
  user.Branch.toLowerCase().includes(query.toLowerCase())
) .map((user) => {
    const originalIndex = users.findIndex(u => u.name === user.name); 
    const image = images[originalIndex % images.length];
    return (
      <div className="outline" key={user.name}>
        <img src={image} alt="mentor" className="imag" />
        <div className="details">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>College:</strong> {user.College}</p>
          <p><strong>Branch:</strong> {user.Branch}</p>
          <p><strong>Languages:</strong> {user.Language}</p>
          <p><strong>Availability Time:</strong></p>
          {user.AT.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
          <p>More About Me
            <a
              href={user.link || "#"}
              target="_blank"
              className="linkedin-icon"
              rel="noreferrer"
            >
              <i className="fab fa-linkedin s"></i>
            </a>
          </p>
        </div>
        <button className="mentorbtn" onClick={() => connectwithmentor(user.name)}>Connect With Me</button>
      </div>
    );
})}

    </div>
  );
}

export { Mentors };
