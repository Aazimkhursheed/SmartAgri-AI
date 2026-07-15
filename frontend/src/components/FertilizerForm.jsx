import { useState } from "react";
import { predictFertilizer } from "../api";
import { startVoiceInput, speakResult } from "../hooks/useVoiceInput";

export default function FertilizerForm() {
  const [form, setForm] = useState({
    N: "", P: "", K: "", ph: "",
    temperature: "", humidity: "", rainfall: "", crop: "rice",
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
      recommended: "🌿 Recommended Fertilizer",
      example: "Example: 90, 40, 40, 6.5, 27, 80, 220, rice",
    },
    hi: {
      title: "🧪 उर्वरक सुझाव",
      predict: "भविष्यवाणी करें",
      analyzing: "⏳ विश्लेषण हो रहा है...",
      voice: "🎤 आवाज़ से इनपुट",
      recommended: "🌿 अनुशंसित उर्वरक",
      example: "उदाहरण: 90, 40, 40, 6.5, 27, 80, 220, चावल",
    },
  };

  const cropOptions = [
    { id: "rice", en: "Rice", hi: "चावल" },
    { id: "wheat", en: "Wheat", hi: "गेहूँ" },
    { id: "maize", en: "Maize", hi: "मक्का" },
    { id: "chickpea", en: "Chickpea", hi: "चना" },
    { id: "kidneybeans", en: "Kidney Beans", hi: "राजमा" },
    { id: "pigeonpeas", en: "Pigeon Peas", hi: "अरहर" },
    { id: "mothbeans", en: "Moth Beans", hi: "मोठ" },
    { id: "mungbean", en: "Mung Bean", hi: "मूंग" },
    { id: "blackgram", en: "Black Gram", hi: "उड़द" },
    { id: "lentil", en: "Lentil", hi: "मसूर" },
    { id: "pomegranate", en: "Pomegranate", hi: "अनार" },
    { id: "banana", en: "Banana", hi: "केला" },
    { id: "mango", en: "Mango", hi: "आम" },
    { id: "grapes", en: "Grapes", hi: "अंगूर" },
    { id: "watermelon", en: "Watermelon", hi: "तरबूज" },
    { id: "muskmelon", en: "Muskmelon", hi: "खरबूजा" },
    { id: "apple", en: "Apple", hi: "सेब" },
    { id: "orange", en: "Orange", hi: "संतरा" },
    { id: "papaya", en: "Papaya", hi: "पपीता" },
    { id: "coconut", en: "Coconut", hi: "नारियल" },
    { id: "cotton", en: "Cotton", hi: "कपास" },
    { id: "jute", en: "Jute", hi: "जूट" },
    { id: "coffee", en: "Coffee", hi: "कॉफी" },
  ];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleVoiceInput = () => {
    startVoiceInput(lang, setForm, true);
  };

  const handleSubmit = async () => {
    if (Object.values(form).some((v) => v === "")) {
      alert(lang === "hi" ? "कृपया सभी फ़ील्ड भरें" : "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await predictFertilizer({
        user_email: localStorage.getItem("email"),
        ...form,
        N: +form.N,
        P: +form.P,
        K: +form.K,
        ph: +form.ph,
        temperature: +form.temperature,
        humidity: +form.humidity,
        rainfall: +form.rainfall,
      });

      setResult(res.data);

      const fertType = res.data.fertilizer_type || "Unknown";
      const quantity = res.data.quantity ? res.data.quantity.toFixed(2) : "0";

      const speakText = lang === "hi" 
        ? `अनुशंसित उर्वरक है ${fertType}. मात्रा ${quantity} किलो प्रति हेक्टेयर है।`
        : `Recommended fertilizer is ${fertType}. Quantity is ${quantity} kg per hectare.`;
      
      speakResult(speakText, lang);

    } catch (err) {
      setResult({ error: err.response?.data?.detail || (lang === "hi" ? "सुझाव प्राप्त करने में त्रुटि" : "Error fetching recommendation") });
    }
    setLoading(false);
  };

  // 🌐 NUMBERED FIELDS (Numerical Only)
  const numericFields = lang === "en"
    ? [
        ["N", "1️⃣ Nitrogen (N)", "Amount of Nitrogen in soil"],
        ["P", "2️⃣ Phosphorus (P)", "Amount of Phosphorus in soil"],
        ["K", "3️⃣ Potassium (K)", "Amount of Potassium in soil"],
        ["ph", "4️⃣ Soil pH", "Acidity or alkalinity"],
        ["temperature", "5️⃣ Temperature (°C)", "Average temperature"],
        ["humidity", "6️⃣ Humidity (%)", "Moisture level"],
        ["rainfall", "7️⃣ Rainfall (mm)", "Water availability"],
      ]
    : [
        ["N", "1️⃣ नाइट्रोजन (N)", "मिट्टी में नाइट्रोजन की मात्रा"],
        ["P", "2️⃣ फॉस्फोरस (P)", "मिट्टी में फॉस्फोरस की मात्रा"],
        ["K", "3️⃣ पोटैशियम (K)", "मिट्टी में पोटैशियम की मात्रा"],
        ["ph", "4️⃣ मिट्टी का pH", "मिट्टी की अम्लता या क्षारीयता"],
        ["temperature", "5️⃣ तापमान (°C)", "औसत तापमान"],
        ["humidity", "6️⃣ आर्द्रता (%)", "हवा में नमी"],
        ["rainfall", "7️⃣ वर्षा (mm)", "औसत वर्षा"],
      ];

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "auto",
        padding: "20px",
      }}
      className="card"
    >
      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2>{t[lang].title}</h2>

        <button
          style={{
            padding: "10px 15px",
            borderRadius: "8px",
            background: "#22c55e",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
        >
          🌐 {lang === "en" ? "हिंदी" : "English"}
        </button>
      </div>

      {/* EXAMPLE */}
      <p style={{
        marginTop: "10px",
        color: "#94a3b8",
        fontSize: "13px"
      }}>
        🎤 {t[lang].example}
      </p>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "25px",
          marginTop: "25px",
        }}
      >
        {numericFields.map(([name, label, desc]) => (
          <div key={name}>
            <label style={{ color: "#fff", fontWeight: "600" }}>
              {label}
            </label>

            <p style={{ fontSize: "12px", color: "#94a3b8" }}>
              {desc}
            </p>

            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={label}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                background: "#334155",
                color: "white",
                border: "1px solid #475569",
              }}
            />
          </div>
        ))}
        
        {/* CROP DROPDOWN */}
        <div>
          <label style={{ color: "#fff", fontWeight: "600" }}>
            {lang === "hi" ? "8️⃣ फसल" : "8️⃣ Crop"}
          </label>
          <p style={{ fontSize: "12px", color: "#94a3b8" }}>
            {lang === "hi" ? "खेती की जाने वाली फसल चुनें" : "Select crop being cultivated"}
          </p>
          <select
            name="crop"
            value={form.crop}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              background: "#334155",
              color: "white",
              border: "1px solid #475569",
              appearance: "none"
            }}
          >
            {cropOptions.map(option => (
              <option key={option.id} value={option.id}>
                {lang === "hi" ? option.hi : option.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* BUTTONS */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginTop: "25px"
        }}
      >
        <button
          style={{
            padding: "12px 25px",
            borderRadius: "10px",
            background: "#22c55e",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
          onClick={handleSubmit}
        >
          {loading ? t[lang].analyzing : t[lang].predict}
        </button>

        <button
          style={{
            padding: "12px 25px",
            borderRadius: "10px",
            background: "#475569",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
          onClick={handleVoiceInput}
        >
          {t[lang].voice}
        </button>
      </div>

      {/* RESULT */}
      {result && !result.error && (
        <div style={{ textAlign: "center", marginTop: "25px", padding: "20px", background: "#1e293b", borderRadius: "10px", border: "1px solid #334155" }}>
          <h3 style={{ color: "#22c55e", fontSize: "24px" }}>
            {t[lang].recommended}: {result.fertilizer_type}
          </h3>
          <p style={{ color: "#cbd5f5", marginTop: "10px" }}>📦 {lang === "hi" ? "मात्रा" : "Quantity"}: {result.quantity?.toFixed(2)} kg/ha</p>
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