# NEXHIRE AI 🚀
> **"Your Skills. Your Future. Your Next Hire."**

World-class, fully functional AI-powered career development & interview preparation platform engineered for college students, engineering freshers, and job seekers preparing for top placements at Google, Microsoft, Amazon, Meta, DeepMind, Apple, and leading tech companies.

---

## 🌟 Key Platform Modules

### 1. 🎙️ Real-Time Conversational AI Interviewers
- **Anway (Senior Staff Engineer)**: Technical interviews, algorithms, CS fundamentals, distributed system architecture, and code error diagnosis.
- **Arvi (Director of Talent & HR)**: Behavioral assessments, STAR method storytelling, communication coaching, and culture-fit evaluations.
- **Hands-Free Live Voice Engine**:
  - Zero-button continuous listening with natural Voice Activity Detection (VAD).
  - Barge-In support: Speak at any time to interrupt the interviewer immediately.
  - Live Speech Subtitles & Real-Time Candidate Spoken Words Streaming.
- **Real-Time Error Feedback**: Identifies explicit errors in Big-O complexity, logic flaws, edge cases, and syntax, providing actionable corrections.

### 2. 📹 Prominent Live Webcam & Computer Vision Coach
- **Dual-Feed Stage**: Candidate's live webcam is displayed prominently side-by-side with Anway/Arvi in high definition.
- **Real-Time Body Language Analysis**:
  - Live Eye Contact Tracking with camera lens yaw detection.
  - Centroid posture tracking for slouching alerts.
  - Motion delta analysis for fidgeting and restlessness.
  - Vocal coaching interventions during mock sessions.

### 3. 💻 DSA & Coding Workspace
- LeetCode-style coding environment with Monaco/CodeMirror editor.
- Multi-language execution support: **Python, JavaScript, C++, and Java**.
- Real-time test case validation, memory usage analysis, and AI hint generation.

### 4. 📄 AI Resume & ATS Analyzer
- Instant resume parsing for `.docx` and `.pdf` files.
- Real-time ATS match scoring, missing critical keywords detection, and formatting audits.
- In-browser live Markdown resume editor with instantaneous PDF export.

### 5. 🏢 Company-Wise Preparation Packs
- Tailored interview rounds, typical questions, and preparation roadmaps for:
  - Google, Microsoft, Amazon, Meta, Apple, DeepMind, Netflix, Uber, and more.

### 6. 🔒 Student Authentication & Persistent Database
- Multi-user account registration with password validation and persistence in local storage database.
- University profile management: College, Branch, Graduation Year, Skills, and Dream Companies.
- In-profile Password & Security controls with instant updates and email password recovery.

---

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **AI Core**: Google Gemini Generative AI (`gemini-3.5-flash-lite`, `gemini-3-flash-preview`).
- **Voice & Speech**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`).
- **Vision AI**: In-browser Canvas Frame Differencing & Centroid Analysis.
- **Charts & Data**: Recharts, Canvas-Confetti, html2pdf.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Google Gemini API key ([Get one free at Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/janvimauka-py/nexhire-ai.git
   cd nexhire-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📄 License
This project is proprietary and built for high-impact campus placements and career preparation.
