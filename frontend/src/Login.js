import {useState} from "react"
import './login.css'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login(){
    const [formData,SetformData]=useState({
            email:"",
            password:""
        });
        const navigate = useNavigate();
        const handlechange=(e)=>{
           SetformData({
            ...formData,
            [e.target.name]:e.target.value
           });
        }
        const handleSubmit=async(e)=>{
        e.preventDefault();
        const response=await fetch("http://localhost:5000/api/auth/login",{
            method:"POST",
            headers: {
        "Content-Type": "application/json"
    },
            body:JSON.stringify(formData)
        });
        const data = await response.json();
         alert(data.message);
          if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.name);
            if(data.role==="mentor"){
            navigate("/mentor")
            }else{
            navigate("/st/mentor-list")
            }
         }
    }

    return(
       <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handlechange} />
            <input type="password" name="password" placeholder="password" onChange={handlechange} />
            <button type="submit">Login</button>
            </form>
            <p className="signup-text">
            Don't have an account? 
            <Link to="/signup" className="signup-link">
                SignUp
            </Link>
            </p>
        </div>
    )
}

export default Login;
