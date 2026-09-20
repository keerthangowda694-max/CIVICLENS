# CIVIC LENS AI

### **“See the Problem. Understand the Impact. Drive the Resolution.”**

**Civic Lens AI** is an AI-powered civic issue intelligence platform that transforms raw citizen observations into structured, prioritized, location-aware civic intelligence. It operationalizes the complete lifecycle:

```text
REPORT → UNDERSTAND → CONNECT → PRIORITIZE → ACT → VERIFY → RESOLVE
```

---

## 🌟 Key Features

1. **Smart AI Reporting (“Tell Civic Lens What You See”)**:
   - Zero-effort citizen reporting with natural language text or **Voice Dictation** (Web Speech API).
   - Real-time AI extraction preview parsing Category, Department, Severity, and Hazards as you speak/type.
   - Multi-photo upload with Computer Vision analysis.

2. **Dual-Engine AI Intelligence Core**:
   - Built-in support for **Google Gemini 1.5 Flash** for advanced reasoning and computer vision.
   - Resilient **Deterministic Fallback Intelligence Engine** providing keyword classification, risk hazard detection, spatial clustering, and explainable scoring out-of-the-box without requiring API keys.

3. **Intelligent Issue Clustering (Duplicate Intelligence)**:
   - Evaluates spatial proximity ($\le 600\text{m}$) and semantic similarity to correlate repeated citizen complaints into **Issue Clusters**.
   - Elevates urgency based on **Report Frequency** instead of discarding complaints as duplicate spam.

4. **0–100 Civic Impact Score & Explainable AI (“Why?”)**:
   - Transparent multi-factor algorithmic scoring:
     - **Severity (40 pts)**
     - **Public Exposure (25 pts)**
     - **Report Frequency (20 pts)**
     - **Location Importance (10 pts)**
     - **Recency (5 pts)**
   - Interactive **“Why?”** modal transparently explaining the score breakdown.
   - **⚠ Urgent Civic Issue** escalation alert for scores $\ge 88$.

5. **Interactive Civic Heatmap**:
   - Dark-themed Leaflet map using CartoDB Dark Matter tiles.
   - Custom colored pins for Roads, Garbage, Water, Lighting, Traffic, and Safety.
   - **Hotspot Heatmap Mode** toggle displaying problem density rings.

6. **Ground-Truth Citizen Verification Loop & Before/After Proof**:
   - Interactive smooth comparison slider inspecting **Before (Citizen Report)** vs **After (Authority Completed Work)**.
   - Citizen community confirmation: **✓ Yes, resolved**, **⚠ Partially resolved**, or **✕ Still exists** with photo evidence.
   - Ensures tickets are not prematurely closed without citizen ground-truth verification.

7. **Floating AI Civic Copilot (“✨ Ask Civic Lens”)**:
   - Context-aware conversational assistant available across all pages and on `/assistant`.
   - Queries live database telemetry to answer questions like *"What is happening near me?"* or *"Show unresolved road issues"*.

8. **Civic Lens Command Center**:
   - Municipal operations console with live KPI metrics, Priority Queue (*“What needs attention first?”*), department override routing, and AI trend insights.

9. **Civic Trust Score & Gamified Badges**:
   - Professional non-punitive contributor reputation system (+10 report, +5 duplicate confirm, +5 verification).
   - Badges: 🏙️ Civic Observer, 🔎 Issue Spotter, 🤝 Community Helper.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Leaflet
- **Backend**: Node.js, Express, Multer (file uploads), JWT authentication, bcryptjs
- **Database**: MongoDB (Mongoose)
- **AI Core**: Google Gemini API / Fallback Civic Intelligence Engine

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or via MongoDB Atlas)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/keerthangowda694-max/CIVICLENS.git
cd CIVICLENS

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 3. Environment Setup
Copy the environment example file in the `server` directory:
```bash
cp server/.env.example server/.env
```
*(Optional)* Add your `GEMINI_API_KEY` to `server/.env`. If omitted, Civic Lens automatically uses its built-in Fallback Intelligence Engine!

### 4. Seed Demo Data
Pre-populate the database with 14 realistic civic issues, 3 duplicate clusters, timelines, and demo accounts:
```bash
cd server
npm run seed
cd ..
```

### 5. Running the Application
Start the backend server:
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

In a second terminal, start the frontend client:
```bash
cd client
npm run dev
# Web app runs on http://localhost:5173
```

---

## 👥 Demo Accounts (1-Click Login)

The application includes 1-click demo switcher buttons on the navigation bar and login page:

| Account | Email | Password | Role | Features |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen Alex Rivera** | `citizen@civiclens.ai` | `password123` | `citizen` | 240 Contributor Points, Report Issues, Verify Resolutions |
| **Admin Sarah Jenkins** | `admin@civiclens.ai` | `password123` | `authority` | Municipal Operations Chief, Command Center, Priority Queue, Dispatch |

---

## 📋 13-Step Live Demo Story

1. Open **[http://localhost:5173](http://localhost:5173)** to view the Landing Page.
2. Navigate to **Report Issue** (`/report`) and click **"Load Live Demo Scenario"**.
3. Real-time AI automatically extracts *Pothole / Road Infrastructure / Public Works / High Severity*.
4. Click **Submit** $\rightarrow$ spatial clustering correlates the report with 8 similar incidents and boosts the Civic Impact Score to `87/100`.
5. Redirected to the Issue Intelligence Page (`/issues/:id`) with the vertical progress timeline.
6. Click **"Why?"** on the Impact Score Gauge to inspect explainable AI reasoning.
7. Inspect the **Duplicate Cluster** diagram showing 8 connected reports and 89% similarity.
8. Switch to **Sarah (Authority)** using the navbar demo switch.
9. Advance the issue status to `AWAITING_VERIFICATION` with field crew notes.
10. Inspect the **Before / After interactive slider** comparing original photo vs resolution photo.
11. Under **Citizen Verification Loop**, click **✓ Yes, Resolved** and submit.
12. Ground truth is confirmed $\rightarrow$ status updates to **RESOLVED ✓** and awards +5 Contributor Points.
13. Open **✨ Ask Civic Lens** floating assistant and ask *“What is happening near me?”* to see real-time copilot answers.

---

## 📄 License
MIT License. Built with ❤️ for Hackathon Excellence.
