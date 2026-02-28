<p align="center">
  <img src="./img.png" alt="EventSync Banner" width="100%">
</p>

# EventSync 🎯
### College Event Chaos Resolver

---

## 📌 Basic Details

**Team Name:** TechNova  

### 👩‍💻 Team Members
- **Erfana Ebrahim** – KMEA Engineering College  
- **[Hannath M A]** – Mar Athanasius college of Engineering kothamangalam

### 🔗 Hosted Project Link
- **Live Demo:** https://eventsync-demo.vercel.app  
- **GitHub Repo:** https://github.com/technova/eventsync  

---

## 📝 Project Description

EventSync is a centralized college event management system designed to eliminate chaos during event coordination.  
It connects organizers, volunteers, and participants through role-based dashboards, real-time updates, task tracking, and emergency alerts.

---

## ❗ The Problem Statement

College events often suffer from:

- Poor communication between teams  
- Manual task tracking  
- Lack of real-time updates  
- Confusion during emergencies  

This leads to delays, inefficiency, and mismanagement.

---

## 💡 The Solution

EventSync provides:

- Role-based dashboards (Organizer, Volunteer, Participant)  
- Real-time task tracking  
- Instant emergency alerts  
- Attendance monitoring  
- Automated event closure system  

This ensures structured workflow, transparency, and accountability.

---

# ⚙️ Technical Details

## 🖥️ Technologies Used

### Software Stack
- **Languages:** JavaScript, HTML, CSS  
- **Frontend:** React.js  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Libraries:** Axios, JWT, Socket.io, Mongoose  
- **Tools:** VS Code, Git, GitHub, Postman, Vercel  

---

# 🚀 Features

- 🔐 Role-Based Authentication  
- 📋 Task Assignment & Status Tracking  
- 🔔 Real-Time Notifications  
- 🚨 Emergency Alert System  
- 📊 Attendance Tracking  
- ✅ Auto-Close Events & Tasks  

---

# 🛠️ Implementation

## 📦 Installation

```bash
git clone https://github.com/technova/eventsync.git
cd eventsync
npm install
▶️ Run Frontend
npm start
▶️ Run Backend
cd server
npm install
npm run dev
📘 Project Documentation
📸 Screenshots


User login page with role-based authentication.


Organizer dashboard for creating events and assigning tasks.


Volunteer dashboard displaying assigned tasks and status updates.

🏗️ System Architecture


Frontend (React)
        ↓
Backend API (Node + Express)
        ↓
MongoDB Database
        ↓
Socket.io (Real-Time Notifications)

🔁 Data Flow

Login → Role Verification → Dashboard → Event Management → Notification Module → Attendance Tracking → Event Closure

🔄 Application Workflow

User logs in

Role-based dashboard loads

Organizer creates event & assigns tasks

Volunteers update task progress

Participants receive live updates

Emergency alerts can be triggered

Event auto-closes after completion

📡 API Documentation
Base URL

🔹 GET /api/events

Description: Fetch all events

Response
{
  "status": "success",
  "data": []
}
🔹 POST /api/events

Description: Create a new event

Request Body
{
  "eventName": "Tech Fest",
  "date": "2026-03-01",
  "location": "Auditorium"
}
Response
{
  "status": "success",
  "message": "Event created successfully"
}
🔹 POST /api/tasks

Description: Assign task to volunteer

Request Body
{
  "taskName": "Stage Setup",
  "assignedTo": "volunteerId",
  "eventId": "eventId"
}
🎥 Project Demo

Demo Video:
https://youtube.com/demo-eventsync

The demo showcases:

Login & authentication

Event creation

Task assignment

Volunteer status update

Real-time notifications

Emergency alert activation

🤖 AI Tools Used

Tool: ChatGPT

Used For:

API structure guidance

Component scaffolding

Debugging support

Documentation formatting

Estimated AI Contribution: ~25%

Human Contributions:

Architecture design

Database schema creation

Core business logic implementation

UI/UX decisions

Testing & deployment

👥 Team Contributions

Erfana Ebrahim: Frontend development, UI/UX, 

[Hannath M.A]: documentation, API integration, Deployment

📜 License

- MIT License (Permissive, widely used)
- Apache 2.0 (Permissive with patent grant)
- GPL v3 (Copyleft, requires derivative works to be open source)

<p align="center"> Made with ❤️ at TinkerHub </p> 
