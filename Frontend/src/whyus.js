import {React,useRef} from "react";
import "./whyus.css";

const Whyus = ({refProp,contactRef}) => {
  return (
    <div ref={refProp} className="footer">
      <h3 className="head">Why us?</h3>
      <div className="carousel-container">
        <div className="iconsdesign">
          <i className="fa fa-users i" aria-hidden="true"></i>
          <p className='matter'>Verified Mentors from Top Institutions</p>
        </div>
        <div className="iconsdesign">
          <i className="fa fa-envelope i" aria-hidden="true"></i>
          <p className='matter'>Instant Email Connection</p>
        </div>
        <div className="iconsdesign">
          <i className="fa fa-calendar i" aria-hidden="true"></i>
          <p className='matter'>Flexible Scheduling</p>
        </div>
        <div className="iconsdesign">
          <i className="fa fa-user-secret i" aria-hidden="true"></i>
          <p className='matter'>Secure Login & Data Privacy</p>
        </div>
        <div className="iconsdesign">
          <i className="fa fa-comments i" aria-hidden="true"></i>
          <p className='matter'>Real-Time Chat with Mentors</p>
        </div>
        <div className="iconsdesign">
          <i className="fa fa-line-chart i" aria-hidden="true"></i>
          <p className='matter'>Track Your Growth</p>
        </div>
      </div>
      <div ref={contactRef}>
      <p className="queries" >For any queries</p>
      <p className='contact'>Contact us on Mentorsconnect@st.com</p>
      </div>
    </div>

  );
};

export {Whyus};
