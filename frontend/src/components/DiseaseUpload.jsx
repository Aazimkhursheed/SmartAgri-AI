import { useState } from "react";
import { predictDisease } from "../api";

function DiseaseUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");

  const t = {
    en: {
      title: "🦠 Disease Detection",
      upload: "Upload & Detect",
      analyzing: "⏳ Analyzing...",
      treatment: "💊 Treatment",
      confidence: "📊 Confidence",
      risk: "⚠ Risk Level",
      voice: "🎤 Voice Command",
      help: "🎤 Say: detect / clear",
    },
    hi: {
      title: "🦠 रोग पहचान",
      upload: "अपलोड करें और जांचें",
      analyzing: "⏳ विश्लेषण हो रहा है...",
      treatment: "💊 उपचार",
      confidence: "📊 विश्वास स्तर",
      risk: "⚠ जोखिम स्तर",
      voice: "🎤 आवाज़ कमांड",
      help: "🎤 बोलें: detect / clear",
    },
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  // 🎤 VOICE COMMAND
  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === "hi" ? "hi-IN" : "en-US";

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      console.log("Voice:", text);

      if (text.includes("detect") || text.includes("पहचान")) {
        handleSubmit();
      }

      if (text.includes("clear") || text.includes("हटाओ")) {
        setFile(null);
        setPreview(null);
        setResult(null);
      }
    };

    recognition.start();
  };

  // 🔊 SPEAK RESULT
  const speakResult = (text) => {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const getTreatment = (disease) => {
    if (!disease) return [];

    disease = disease.toLowerCase();

    if (disease.includes("blight"))
      return lang === "hi"
        ? ["कार्बेन्डाजिम स्प्रे करें", "संक्रमित पत्तियाँ हटाएँ"]
        : ["Spray Carbendazim", "Remove infected leaves"];

    if (disease.includes("rust"))
      return lang === "hi"
        ? ["सल्फर फंगीसाइड उपयोग करें", "ऊपर से पानी न डालें"]
        : ["Use sulfur-based fungicide", "Avoid overhead watering"];

    if (disease.includes("mildew"))
      return lang === "hi"
        ? ["नीम तेल स्प्रे करें", "हवा का प्रवाह बनाए रखें"]
        : ["Apply neem oil spray", "Ensure proper air circulation"];

    return lang === "hi"
      ? ["विशेषज्ञ से सलाह लें", "सामान्य फंगीसाइड उपयोग करें"]
      : ["Consult agricultural expert", "Use general fungicide"];
  };

  const getRisk = (confidence) => {
    if (confidence > 80) return lang === "hi" ? "उच्च" : "High";
    if (confidence > 50) return lang === "hi" ? "मध्यम" : "Medium";
    return lang === "hi" ? "कम" : "Low";
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await predictDisease(formData);

      const disease = res.data.disease || "Unknown";
      const confidence = res.data.confidence || 0;

      const finalResult = {
        disease,
        confidence,
        treatment: getTreatment(disease),
        risk: getRisk(confidence),
      };

      setResult(finalResult);

      // 🔊 SPEAK OUTPUT
      speakResult(
        lang === "hi"
          ? `रोग है ${disease}`
          : `Detected disease is ${disease}`
      );

    } catch (err) {
      console.error(err);
      setResult({ error: "Error detecting disease" });
    }
    setLoading(false);
  };

  return (
    <div className="card">
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>{t[lang].title}</h2>

        <button onClick={() => setLang(lang === "en" ? "hi" : "en")}>
          🌐 {lang === "en" ? "हिंदी" : "English"}
        </button>
      </div>

      {/* VOICE GUIDE */}
      <p style={{ fontSize: "12px", color: "#94a3b8" }}>
        {t[lang].help}
      </p>

      <input type="file" onChange={handleFileChange} />

      {/* IMAGE PREVIEW */}
      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{ width: "100%", borderRadius: "10px", marginTop: "10px" }}
        />
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={handleSubmit}>
          {loading ? t[lang].analyzing : t[lang].upload}
        </button>

        <button onClick={startVoiceInput}>
          {t[lang].voice}
        </button>
      </div>

      {/* RESULT */}
      {result && !result.error && (
        <div className="result-card">
          <h3>🍃 {result.disease}</h3>

          <p>
            {t[lang].confidence}: {result.confidence}%
          </p>
          <p>
            {t[lang].risk}: {result.risk}
          </p>

          <div className="section">
            <h4>{t[lang].treatment}</h4>
            <ul>
              {result.treatment.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {result?.error && <p>{result.error}</p>}
    </div>
  );
}

export default DiseaseUpload;