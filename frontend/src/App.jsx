import { useState } from "react";

import CropForm from "./components/CropForm";
import FertilizerForm from "./components/FertilizerForm";
import DiseaseUpload from "./components/DiseaseUpload";
import CropEvaluation from "./components/CropEvaluation";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";

import "./App.css";

export default function App() {

  const [tab, setTab] = useState("dashboard");

  const [user, setUser] = useState(
    localStorage.getItem("email") || null
  );

  // SHOW LOGIN PAGE FIRST
  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <div className="container">

      {/* HEADER */}
<div className="header">

  <div className="header-left">

    <h1>🌾 SmartAgri AI</h1>

    <p className="subtitle">
      AI-powered decision support system for farmers
    </p>

  </div>

  <div className="profile-box">

    <img
      src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
      alt="farmer"
      className="profile-img"
    />

    <div className="profile-info">

      <h3>
        {localStorage.getItem("email")?.split("@")[0]}
      </h3>

      <p>
        {localStorage.getItem("email")}
      </p>

    </div>

    <button
      className="logout-btn"
      onClick={() => {
        localStorage.clear();
        window.location.reload();
      }}
    >
      Logout
    </button>

  </div>

</div>

      {/* TABS */}
      <div className="tabs">

        <div
          className={`tab ${tab === "dashboard" ? "active" : ""}`}
          onClick={() => setTab("dashboard")}
        >
          📊 Dashboard
        </div>

        <div
          className={`tab ${tab === "crop" ? "active" : ""}`}
          onClick={() => setTab("crop")}
        >
          🌱 Crop
        </div>

        <div
          className={`tab ${tab === "fertilizer" ? "active" : ""}`}
          onClick={() => setTab("fertilizer")}
        >
          🧪 Fertilizer
        </div>

        <div
          className={`tab ${tab === "disease" ? "active" : ""}`}
          onClick={() => setTab("disease")}
        >
          🦠 Disease
        </div>

        <div
          className={`tab ${tab === "evaluation" ? "active" : ""}`}
          onClick={() => setTab("evaluation")}
        >
          📈 Evaluation
        </div>



      </div>

      {/* CONTENT */}
      <div className="content">

        {tab === "dashboard" && <Dashboard />}

        {tab === "crop" && <CropForm />}

        {tab === "fertilizer" && <FertilizerForm />}

        {tab === "disease" && <DiseaseUpload />}

        {tab === "evaluation" && <CropEvaluation />}

      </div>

      {/* FOOTER */}
      <div className="footer">
        <p>🚀 Built for smarter farming decisions</p>
      </div>

    </div>
  );
}