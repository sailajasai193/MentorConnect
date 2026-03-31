const { google } = require("googleapis");

require("dotenv").config(); // loads .env

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5000/oauth2callback"
);



const scopes = ["https://www.googleapis.com/auth/calendar"];

const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  prompt: "consent" 
});

console.log("Visit this URL to get the code:", url);