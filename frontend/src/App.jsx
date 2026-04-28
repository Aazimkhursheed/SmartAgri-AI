import { useState } from "react";
import CropForm from "./components/CropForm";
import FertilizerForm from "./components/FertilizerForm";
import DiseaseUpload from "./components/DiseaseUpload";

export default function App() {
  const [tab, setTab] = useState("crop");

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <h1>🌾 SmartAgri AI</h1>
        <p className="subtitle">
          AI-powered decision support system for farmers
        </p>
      </div>

      {/* TABS */}
      <div className="tabs">
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
      </div>

      {/* CONTENT */}
      <div className="content">
        {tab === "crop" && <CropForm />}
        {tab === "fertilizer" && <FertilizerForm />}
        {tab === "disease" && <DiseaseUpload />}
      </div>

      {/* FOOTER (BIG IMPRESSION) */}
      <div className="footer">
        <p>🚀 Built for smarter farming decisions</p>
      </div>
    </div>
  );
}