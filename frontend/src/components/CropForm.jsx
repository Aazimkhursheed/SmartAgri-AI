import { useState } from "react";
import { predictCrop } from "../api";

export default function CropForm() {
  const [form, setForm] = useState({
    N: "",
    P: "",
    K: "",
    ph: "",
    temperature: "",
    humidity: "",
    rainfall: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");

  const t = {
    en: {
      title: "🌱 Crop Recommendation",
      predict: "Predict",
      analyzing: "⏳ Analyzing...",
      voice: "🎤 Voice Input",
      why: "🤖 Why this recommendation?",
      suggestions: "💡 Suggestions",
      recommended: "🌾 Recommended Crop",
      help: "🎤 Say: 90 40 40 6.5 27 80 220",
    },
    hi: {
      title: "🌱 फसल सुझाव",
      predict: "भविष्यवाणी करें",
      analyzing: "⏳ विश्लेषण हो रहा है...",
      voice: "🎤 आवाज़ से इनपुट",
      why: "🤖 यह सुझाव क्यों?",
      suggestions: "💡 सुझाव",
      recommended: "🌾 अनुशंसित फसल",
      help: "🎤 बोलें: 90 40 40 6.5 27 80 220",
    },
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🎤 IMPROVED VOICE INPUT
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

      const nums = text.match(/\d+(\.\d+)?/g);

      if (nums && nums.length >= 7) {
        setForm({
          N: nums[0],
          P: nums[1],
          K: nums[2],
          ph: nums[3],
          temperature: nums[4],
          humidity: nums[5],
          rainfall: nums[6],
        });
      } else {
        alert(
          lang === "hi"
            ? "सभी 7 मान स्पष्ट बोलें"
            : "Speak all 7 values clearly"
        );
      }
    };

    recognition.start();
  };

  // 🤖 INSIGHTS
  const generateInsights = (data, crop) => {
    let reasons = [];
    let suggestions = [];

    if (data.rainfall > 200)
      reasons.push(lang === "hi" ? "अधिक वर्षा" : "High rainfall");

    if (data.temperature > 25)
      reasons.push(lang === "hi" ? "उच्च तापमान" : "Warm temperature");

    if (data.ph >= 6 && data.ph <= 7.5)
      reasons.push(lang === "hi" ? "उचित pH" : "Optimal soil pH");

    if (data.N < 50)
      suggestions.push(
        lang === "hi" ? "नाइट्रोजन बढ़ाएँ" : "Increase nitrogen"
      );

    if (data.P < 40)
      suggestions.push(
        lang === "hi" ? "फास्फोरस बढ़ाएँ" : "Add phosphorus"
      );

    if (data.K < 40)
      suggestions.push(
        lang === "hi" ? "पोटैशियम बढ़ाएँ" : "Add potassium"
      );

    if (suggestions.length === 0) {
      suggestions.push(
        lang === "hi"
          ? "मिट्टी संतुलित है"
          : "Soil nutrients are balanced"
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        lang === "hi"
          ? "परिस्थितियाँ अनुकूल हैं"
          : "Conditions are suitable"
      );
    }

    return { reasons, suggestions };
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload = {
        N: Number(form.N),
        P: Number(form.P),
        K: Number(form.K),
        ph: Number(form.ph),
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
        rainfall: Number(form.rainfall),
      };

      const res = await predictCrop(payload);

      const crop =
        res.data.prediction ||
        res.data.crop ||
        res.data.result ||
        "Unknown";

      const insights = generateInsights(payload, crop);

      setResult({
        crop,
        ...insights,
      });

    } catch (err) {
      console.error(err);
      setResult({ error: "Error fetching prediction" });
    }

    setLoading(false);
  };

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>{t[lang].title}</h2>

        <button onClick={() => setLang(lang === "en" ? "hi" : "en")}>
          🌐 {lang === "en" ? "हिंदी" : "English"}
        </button>
      </div>

      {/* 🎤 GUIDE TEXT */}
      <p style={{ fontSize: "12px", color: "#94a3b8" }}>
        {t[lang].help}
      </p>

      {[
        "N",
        "P",
        "K",
        "ph",
        "temperature",
        "humidity",
        "rainfall",
      ].map((f) => (
        <input
          key={f}
          name={f}
          placeholder={f}
          value={form[f]}
          onChange={handleChange}
        />
      ))}

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={handleSubmit}>
          {loading ? t[lang].analyzing : t[lang].predict}
        </button>

        <button onClick={startVoiceInput}>
          {t[lang].voice}
        </button>
      </div>

      {result && !result.error && (
        <div className="result-card">
          <h3>
            {t[lang].recommended}: {result.crop}
          </h3>

          <div className="section">
            <h4>{t[lang].why}</h4>
            <ul>
              {result.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h4>{t[lang].suggestions}</h4>
            <ul>
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {result?.error && <p>{result.error}</p>}
    </div>
  );
}