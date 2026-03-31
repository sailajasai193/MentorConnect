const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

async function getTokens() {
  const code = "4/0AfrIepAZlAtRQR6pxLGjywZR6-EB2kx01yeIbXHztgoNMk_zsG1xPUyxny-W61F7vRbrSQ"; 
  const { tokens } = await oauth2Client.getToken(code);

  console.log("Access Token:", tokens.access_token);
  console.log("Refresh Token:", tokens.refresh_token);
}

getTokens();