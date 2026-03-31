// Components/Footer.jsx
import React from "react";

function Footer() {
  return (  
    <footer style={{
      width: "100%",
      textAlign: "center",
      marginTop: "40px",
      paddingBottom: "5px"
    }}>
      <p style={{
        fontSize: "15px",
        color: "#000000",
        textTransform: "lowercase",
        margin: "0"
      }}>
        &copy; 2026 MentorConnect. all rights reserved.
      </p>
    </footer>
  );
}

export default Footer;