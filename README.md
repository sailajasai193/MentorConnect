# MentorConnect 🚀

**MentorConnect** is a **full-stack MERN (MongoDB, Express, React, Node.js) web application** designed to **connect students with mentors** seamlessly. It integrates cutting-edge AI tools and automation to enhance the mentorship experience, providing smart scheduling, AI-generated session summaries, and automated Google Meet links.  

---

## 🌟 Key Features

- **User Authentication:** Secure login/signup for students and mentors using **JWT (JSON Web Tokens)**.  
- **AI-Powered Assistance:**  
  - Integration with **LangChain**, **Whisper AI**, and **Groq LLM API** for generating insights and meeting summaries automatically.  
- **Automatic Session Scheduling:** Students can schedule mentorship sessions, and the system automatically generates **Google Meet links** for each session.  
- **Email Notifications:** Automatic email reminders for upcoming sessions.  
- **Secure File Handling:** File uploads (assignments, notes) with **Multer**, safely stored in the server.  
- **Role-Based Access:** Different views and access for **students** and **mentors**.  
- **Environment-Based Secrets:** API keys and secrets are stored in `.env` files for maximum security.  

---

## 🛠 Tech Stack & Integrations

| Layer | Technology / Tool |
|-------|------------------|
| **Frontend** | React.js |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT (JSON Web Tokens) |
| **AI & NLP** | LangChain, Whisper AI, Groq LLM API |
| **File Uploads** | Multer |
| **External APIs** | Google Calendar API, Google OAuth 2.0 |
| **Dev Tools** | Node.js, NPM, VS Code |

---

## 🚀 Project Workflow & Approach

1. **Authentication & Security:**  
   - Users sign up with email and password.  
   - JWT tokens are issued upon login for secure session management.  
   - Sensitive credentials (Google OAuth, Groq API keys) are stored in `.env`.  

2. **Mentorship Scheduling:**  
   - Students select a mentor and schedule a session.  
   - The system automatically generates a **unique Google Meet link** for the session.  

3. **AI-Powered Summaries:**  
   - Sessions can be recorded, and Whisper AI transcribes audio automatically.  
   - LangChain and Groq LLM analyze transcripts and generate **concise summaries** for both students and mentors.  

4. **Email & Notifications:**  
   - Email templates are integrated into backend using **NodeMailer**.  

5. **Frontend Experience:**  
   - Responsive **React UI** for smooth student and mentor interaction.  
   - Interactive dashboards show upcoming sessions, past summaries, and mentor availability.  

6. **Backend & Database:**  
   - Express.js server handles REST API endpoints.  
   - MongoDB stores users, sessions, and AI-generated summaries.  

---

## ⚡ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/sailajasai193/MentorConnect.git
cd MentorConnect

Install dependencies
Backend:
cd server
npm install

Frontend:
cd ../frontend
npm install

Create a .env file in the server/ folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GROQ_API_KEY=your_groq_api_key

4. Run the Application
Backend:
cd server
npm start
Frontend:
cd ../frontend
npm start
