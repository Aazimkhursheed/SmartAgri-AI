import { useState } from "react";
import { predictDisease } from "../api";
import { speakResult } from "../hooks/useVoiceInput";

export default function DiseaseUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");

  const t = {
    en: {
      title: "🦠 Disease Detection",
      detect: "Detect Disease",
      analyzing: "⏳ Analyzing...",
      disease: "Detected Disease",
      confidence: "Confidence",
    },
    hi: {
      title: "🦠 रोग पहचान",
      detect: "रोग पहचानें",
      analyzing: "⏳ विश्लेषण हो रहा है...",
      disease: "पहचाना गया रोग",
      confidence: "विश्वास स्तर",
    },
  };

  const diseaseSuggestions = {
    "Potato Early Blight": { 
      en: "Remove infected leaves. Apply copper-based fungicide.", 
      hi: "संक्रमित पत्तियों को हटा दें। तांबे आधारित कवकनाशी लगाएं।" 
    },
    "Potato Late Blight": { 
      en: "Destroy infected plants. Ensure good drainage and use fungicide.", 
      hi: "संक्रमित पौधों को नष्ट करें। अच्छी जल निकासी सुनिश्चित करें और कवकनाशी का उपयोग करें।" 
    },
    "Tomato Late Blight": { 
      en: "Avoid overhead watering. Apply protectant fungicides.", 
      hi: "ऊपर से पानी देने से बचें। सुरक्षात्मक कवकनाशी लगाएं।" 
    },
    "Tomato Healthy": { 
      en: "Plant is healthy! Maintain regular care and watering.", 
      hi: "पौधा स्वस्थ है! नियमित देखभाल और सिंचाई बनाए रखें।" 
    },
    "Unknown": { 
      en: "Apply proper treatment early and monitor plant regularly.", 
      hi: "समय पर उपचार करें और पौधों की नियमित निगरानी करें।" 
    }
  };

  // 📷 FILE HANDLER
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  // 🚀 DETECT
  const handleDetect = async () => {
    if (!file) {
      alert(lang === "hi" ? "कृपया एक छवि अपलोड करें" : "Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_email", localStorage.getItem("email") || "");

    setLoading(true);
    try {
      const res = await predictDisease(formData);

      const detected = res.data.disease || "Unknown";
      const conf = res.data.confidence || 0;

      setResult({
        disease: detected,
        confidence: conf,
      });

      // Build speech text
      const suggestionText = (diseaseSuggestions[detected] && diseaseSuggestions[detected][lang]) || diseaseSuggestions["Unknown"][lang];
      const speakText = lang === "hi" 
        ? `पहचाना गया रोग है ${detected}. ${suggestionText}`
        : `Detected disease is ${detected}. ${suggestionText}`;
      
      speakResult(speakText, lang);

      // 🔥 Reset input after detection (optional, but keep preview for UX)
      // setFile(null);

    } catch (err) {
      setResult({ error: err.response?.data?.detail || (lang === "hi" ? "पहचान विफल रही" : "Detection failed") });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "auto", padding: "25px" }} className="card">

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>{t[lang].title}</h2>

        <button
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
          style={{
            padding: "10px 15px",
            background: "#22c55e",
            borderRadius: "8px",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          🌐 {lang === "en" ? "हिंदी" : "English"}
        </button>
      </div>

      {/* UPLOAD */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ color: "white" }}
        />
      </div>

      {/* PREVIEW */}
      {preview && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <img
            src={preview}
            alt="preview"
            style={{
              maxWidth: "300px",
              borderRadius: "12px",
              border: "1px solid #475569",
            }}
          />
        </div>
      )}

      {/* BUTTON */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "25px"
      }}>
        <button
          onClick={handleDetect}
          style={{
            padding: "12px 28px",
            background: "#22c55e",
            borderRadius: "8px",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          {loading ? t[lang].analyzing : t[lang].detect}
        </button>
      </div>

      {/* RESULT */}
      {result && !result.error && (
        <div style={{
          marginTop: "30px",
          padding: "25px",
          borderRadius: "14px",
          background: "#1e293b",
          border: "1px solid #334155",
          textAlign: "center",
        }}>
          <h1 style={{ color: "#22c55e", fontSize: "26px" }}>
            🌿 {t[lang].disease}: {result.disease}
          </h1>

          <p style={{ fontSize: "16px", marginTop: "10px" }}>
            {t[lang].confidence}: {result.confidence}%
          </p>

          <p style={{ color: "#cbd5f5", marginTop: "10px" }}>
            💡 {(diseaseSuggestions[result.disease] && diseaseSuggestions[result.disease][lang]) || diseaseSuggestions["Unknown"][lang]}
          </p>
        </div>
      )}

      {result?.error && (
        <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
          {result.error}
        </p>
      )}
    </div>
  );
}