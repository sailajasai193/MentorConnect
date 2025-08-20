import React, { useState,useRef } from 'react';
import './entry.css';
import logo from './assets/MClogo.png';
import { Whyus } from './whyus';
import axios from 'axios';

function Header({ scrollToWhyUs, scrollToContact }) {
  const [showLogin, setShowLogin] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isLoginForm, setIsLoginForm] = useState(false);  
  const [loggedIn, setLoggedIn] = useState(false);

  const toggleLogin = () => {
    setShowLogin(!showLogin);
    setIsLoginForm(false); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    axios.post('http://localhost:5000/register', {
      name,
      email,
      password
    })
    .then(res => {
      console.log("Success:", res.data);
      localStorage.setItem("userEmail", email);
      alert("You are Signed Up");
      setLoggedIn(true);
      toggleLogin(); 
    })
    .catch(err => {
      if (err.response && err.response.status === 409) {
        alert("User already exists.");
        setEmail('');
      } else {
        console.error("Error:", err);
        alert("Something went wrong. Please try again.");
      }
    });
  };

  const handleLogin = (e) => {
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  axios.post('http://localhost:5000/login', {
    email,
    password
  })
  .then(res => {
    console.log("Login Response:", res.data);
    if (res.data === "success") {
      localStorage.setItem("userEmail",email);
      alert("Login successful");
      setLoggedIn(true);
      toggleLogin(); 
    } else {
      alert(res.data); 
    }
  })
  .catch(err => {
    console.error("Login Error:", err);
    alert("Login failed due to server error.");
  });
};


   
  return (
    <>
      <div className="heading">
        <div className="header">
          <div className="header-left">
            <img className='logo' src={logo} />
            <p className='Aboutus'>MentorsConnect</p>
          </div>
          <div className="header-right">
            {loggedIn ? (
              <button className="btn" onClick={() => window.location.href = "/mentors"}>Go to Mentors Page</button>
            ) : (
              <button className="btn" onClick={toggleLogin}>Login/Register</button>
            )}
            <p onClick={scrollToWhyUs} className='Aboutus'>Why us</p>
            <p onClick={scrollToContact} className='Aboutus'>Contact Us</p>
          </div>

        </div>
      </div>

      {showLogin && (
        <div className="login-popup">
          <div className="login-box">
            {isLoginForm ? (
              <>
                <h4>Log In</h4>
                <p className='para'>Enter Email</p>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br />
                
                <p className='para'>Enter Password</p>
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br />
                
                <button className="login-submit" onClick={handleLogin}>Log In</button>

                <hr />
                <p className='already'>New user?</p>
                <button className="loginbtn" onClick={() => setIsLoginForm(false)}>Sign Up</button>
              </>
            ) : (
              <>
                <h4>Welcome! SignUp</h4>

                <p className='para'>Enter Name</p>
                <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} /><br />

                <p className='para'>Enter Email</p>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br />

                <p className='para'>Enter Password</p>
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br />

                <p>You agree to our terms and policies</p>
                <button className="login-submit" onClick={handleSubmit}>Sign Up</button>

                <hr />
                <p className='already'>Already have an account?</p>
                <button className="loginbtn" onClick={() => setIsLoginForm(true)}>Log In</button>
              </>
            )}
            <button className="login-close" onClick={toggleLogin}>X</button>
          </div>
        </div>
      )}
    </>
  );
}

export { Header };
