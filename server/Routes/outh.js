const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

router.get("/oauth2callback", async (req, res) => {
  try {
    const code = req.query.code; // this is the code Google sends

    if (!code) return res.send("No code received from Google.");

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token); // save this

    // Show a confirmation in the browser
    res.send(`
      <h2>Tokens Received!</h2>
      <p>Access Token: ${tokens.access_token}</p>
      <p>Refresh Token: ${tokens.refresh_token}</p>
      <p>Save this refresh token in your .env file to use in createMeet.js</p>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error exchanging code for tokens.");
  }
});

module.exports = router;