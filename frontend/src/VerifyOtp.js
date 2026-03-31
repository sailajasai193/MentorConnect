import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './VerifyOtp.css'


function VerifyOtp(){

      const [otp,setOtp]=useState("")
      const navigate=useNavigate()
      const email=localStorage.getItem("otpEmail")

      const handleSubmit=async(e)=>{

            e.preventDefault()
            const response=await fetch("http://localhost:5000/api/auth/verify-otp",{
              method:"POST",
              headers:{
                "Content-Type":"application/json"
              },
              body:JSON.stringify({email,otp})
          })
          const data=await response.json()
          alert(data.message)
          if(response.ok){
            localStorage.setItem("token",data.token);
            if(data.role === "mentor"){
            navigate("/setup");
            }else{
            navigate("/st/mentor-list")
            }
          }
    }

      return(

        <div className="otp-div">
        <h2>Enter OTP</h2>
        <form onSubmit={handleSubmit}>
        <input placeholder="Enter OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} />
        <button className="otp-btn">Verify</button>
        </form>
        </div>
      )

}

export default VerifyOtp