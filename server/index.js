const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();
const router = express.Router();

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./Routes/SignUp.Routes');
const Availability = require('./Routes/AvailablitySlots.Routes');
const file = require('./Routes/Audio.Routes');
const profile=require('./Routes/ProfileSetup');
const frontpage=require('./Routes/frontpage.Routes');
const oauthRoutes = require("./Routes/outh");
const StudentSessions=require("./Routes/St_slots.Routes");

// MongoDB
mongoose.connect("mongodb://localhost:27017/MentorConnect")
.then(() => {
    console.log("MongoDB connected");

    app.use("/api/auth", authRoutes);
    app.use("/api/slots", Availability);
    app.use("/api", file);
    app.use("/api/mentor",profile);
    app.use("/api/today",frontpage);
    app.use("/", oauthRoutes);
    app.use("/api/student",StudentSessions)

    app.listen(port, () => {
        console.log(`Server running at ${port}`);
    });
})
.catch((err) => {
    console.log("Database connection error:", err);
});