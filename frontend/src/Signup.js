import { useState } from "react";
import "./Signup.css";
import { useNavigate, Link } from "react-router-dom";

function Signup() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: ""
    });

    const navigate = useNavigate();

    const handlechange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {
            localStorage.setItem("otpEmail", formData.email);
            localStorage.setItem("username", formData.name);
            navigate("/verify-otp");
        }
    };

    return (
        <div className="signup-container">

            <h2>Signup</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handlechange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handlechange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handlechange}
                    required
                />

                <select name="role" onChange={handlechange} required>
                    <option value="">Select Role</option>
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                </select>

                <button type="submit">Register</button>

            </form>

            <p className="login-text">
                Already have an account?
                <Link to="/" className="signup-link">
                    Login
                </Link>
            </p>

        </div>
    );
}

export default Signup;