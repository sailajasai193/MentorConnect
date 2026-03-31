const { google } = require("googleapis");
require("dotenv").config();

// Create OAuth2 client
const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });


const calendar = google.calendar({ version: "v3", auth });

async function createGoogleMeet({ studentEmail, mentorEmail, date, startTime, endTime }) {
  const event = {
    summary: "Mentor Session",
    description: `Session between ${studentEmail} & ${mentorEmail}`,
    start: { dateTime: new Date(`${date}T${startTime}`), timeZone: "Asia/Kolkata" },
    end: { dateTime: new Date(`${date}T${endTime}`), timeZone: "Asia/Kolkata" },
    attendees: [{ email: studentEmail }, { email: mentorEmail }],
    conferenceData: { createRequest: { requestId: `meet-${Date.now()}` } },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
    conferenceDataVersion: 1,
  });

  return {
    meetingLink: response.data.hangoutLink,
    eventId: response.data.id,            
  };
}

module.exports = { createGoogleMeet };