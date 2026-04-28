import { useState } from "react";
import { predictFertilizer } from "../api";

export default function FertilizerForm() {
  const [form, setForm] = useState({
    N: "",
    P: "",
    K: "",
    ph: "",
    temperature: "",
    humidity: "",
    rainfall: "",
    crop: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");

  const t = {
    en: {
      title: "🧪 Fertilizer Recommendation",
      predict: "Predict",
      analyzing: "⏳ Analyzing...",
      voice: "🎤 Voice Input",
      why: "🤖 Why this?",
      usage: "💡 Usage",
      recommended: "🌿 Recommended",
      help: "🎤 Say: 90 40 40 6.5 27 80 220 rice",
    },
    hi: {
      title: "🧪 उर्वरक सुझाव",
      predict: "भविष्यवाणी करें",
      analyzing: "⏳ विश्लेषण हो रहा है...",
      voice: "🎤 आवाज़ से इनपुट",
      why: "🤖 यह क्यों?",
      usage: "💡 उपयोग",
      recommended: "🌿 अनुशंसित",
      help: "🎤 बोलें: 90 40 40 6.5 27 80 220 rice",
    },
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🎤 VOICE INPUT
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
        setForm((prev) => ({
          ...prev,
          N: nums[0],
          P: nums[1],
          K: nums[2],
          ph: nums[3],
          temperature: nums[4],
          humidity: nums[5],
          rainfall: nums[6],
        }));
      }

      // detect crop
      const words = text.split(" ");
      const cropWord = words.find((w) =>
        ["rice", "wheat", "maize"].includes(w)
      );

      if (cropWord) {
        setForm((prev) => ({ ...prev, crop: cropWord }));
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

  // 🤖 INSIGHTS
  const getInsights = (data) => {
    let reasons = [];

    if (data.N < 50)
      reasons.push(lang === "hi" ? "नाइट्रोजन कम है" : "Low nitrogen");

    if (data.P < 40)
      reasons.push(lang === "hi" ? "फास्फोरस कम है" : "Low phosphorus");

    if (data.K < 40)
      reasons.push(lang === "hi" ? "पोटैशियम कम है" : "Low potassium");

    if (reasons.length === 0) {
      reasons.push(
        lang === "hi" ? "मिट्टी संतुलित है" : "Soil nutrients balanced"
      );
    }

    return reasons;
  };

  const getUsage = (fertilizer) => {
    if (!fertilizer) return [];

    fertilizer = fertilizer.toLowerCase();

    if (fertilizer.includes("urea"))
      return lang === "hi"
        ? ["शुरुआती चरण में उपयोग करें", "कई बार में डालें"]
        : ["Apply in early stage", "Use in split doses"];

    if (fertilizer.includes("dap"))
      return lang === "hi"
        ? ["बुवाई से पहले डालें", "जड़ों के लिए अच्छा"]
        : ["Apply before sowing", "Good for roots"];

    return lang === "hi"
      ? ["विशेषज्ञ से सलाह लें"]
      : ["Consult expert"];
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload = {
        ...form,
        N: Number(form.N),
        P: Number(form.P),
        K: Number(form.K),
        ph: Number(form.ph),
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
        rainfall: Number(form.rainfall),
      };

      const res = await predictFertilizer(payload);

      const fertilizer = res.data.fertilizer_type;
      const quantity = res.data.quantity;

      const finalResult = {
        fertilizer,
        quantity,
        insights: getInsights(payload),
        usage: getUsage(fertilizer),
      };

      setResult(finalResult);

      speakResult(
        lang === "hi"
          ? `अनुशंसित उर्वरक ${fertilizer}`
          : `Recommended fertilizer is ${fertilizer}`
      );

    } catch (err) {
      console.error(err);
      setResult({ error: "Error fetching recommendation" });
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
        "crop",
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
            {t[lang].recommended}: {result.fertilizer}
          </h3>

          <p>📦 Quantity: {result.quantity?.toFixed(2)}</p>

          <div className="section">
            <h4>{t[lang].why}</h4>
            <ul>
              {result.insights.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h4>{t[lang].usage}</h4>
            <ul>
              {result.usage.map((u, i) => (
                <li key={i}>{u}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {result?.error && <p>{result.error}</p>}
    </div>
  );
}