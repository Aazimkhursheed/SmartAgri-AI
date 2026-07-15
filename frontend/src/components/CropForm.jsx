import { useState } from "react";
import { predictCrop } from "../api";
import { startVoiceInput, speakResult } from "../hooks/useVoiceInput";

export default function CropForm() {
  const [form, setForm] = useState({
    N: "", P: "", K: "", ph: "",
    temperature: "", humidity: "", rainfall: "",
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
      recommended: "🌾 Recommended Crop",
      example: "Example: 90, 40, 40, 6.5, 27, 80, 220",
    },
    hi: {
      title: "🌱 फसल सुझाव",
      predict: "भविष्यवाणी करें",
      analyzing: "⏳ विश्लेषण हो रहा है...",
      voice: "🎤 आवाज़ से इनपुट",
      recommended: "🌾 अनुशंसित फसल",
      example: "उदाहरण: 90, 40, 40, 6.5, 27, 80, 220",
    },
  };

  const cropSuggestions = {
    rice: { en: "Requires heavy watering. Ideal for clayey soils.", hi: "अधिक सिंचाई की आवश्यकता है। चिकनी मिट्टी के लिए आदर्श।" },
    wheat: { en: "Moderate watering. Best in loamy soil.", hi: "मध्यम सिंचाई। दोमट मिट्टी में सबसे अच्छा।" },
    maize: { en: "Needs well-drained soil and plenty of sunlight.", hi: "अच्छी तरह से सूखी मिट्टी और भरपूर धूप की आवश्यकता है।" },
    cotton: { en: "Black soil is ideal. Avoid excessive water.", hi: "काली मिट्टी आदर्श है। अत्यधिक पानी से बचें।" },
    jute: { en: "Needs warm and humid climate.", hi: "गर्म और आर्द्र जलवायु की आवश्यकता है।" },
    coffee: { en: "Best grown in hill slopes with shaded sunlight.", hi: "छायांकित धूप वाले पहाड़ी ढलानों में सबसे अच्छा उगाया जाता है।" },
    default: { en: "Maintain proper irrigation and balanced fertilizer usage.", hi: "उचित सिंचाई और संतुलित उर्वरक उपयोग बनाए रखें।" }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleVoiceInput = () => {
    startVoiceInput(lang, setForm, false);
  };

  const handleSubmit = async () => {
    if (Object.values(form).some((v) => v === "")) {
      alert(lang === "hi" ? "कृपया सभी फ़ील्ड भरें" : "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await predictCrop({
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

      const predicted = res.data.prediction || "Unknown";
      setResult({ crop: predicted });

      // Build speech text
      const suggestionText = (cropSuggestions[predicted] && cropSuggestions[predicted][lang]) || cropSuggestions.default[lang];
      const speakText = lang === "hi" 
        ? `अनुशंसित फसल है ${predicted}. ${suggestionText}`
        : `Recommended crop is ${predicted}. ${suggestionText}`;
      
      speakResult(speakText, lang);

      // Reset form optionally
      // setForm({
      //   N: "", P: "", K: "", ph: "",
      //   temperature: "", humidity: "", rainfall: "",
      // });

    } catch (err) {
      setResult({ error: err.response?.data?.detail || (lang === "hi" ? "सर्वर से जुड़ने में त्रुटि" : "Error connecting to server") });
    }
    setLoading(false);
  };

  // 🌐 NUMBERED FIELDS
  const fields = lang === "en"
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
        ["humidity", "6️⃣ आर्द्रता (%)", "नमी स्तर"],
        ["rainfall", "7️⃣ वर्षा (mm)", "पानी की उपलब्धता"],
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
        {fields.map(([name, label, desc]) => (
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
            {t[lang].recommended}: {result.crop}
          </h3>
          <p style={{ color: "#cbd5f5", marginTop: "10px" }}>
            💡 {(cropSuggestions[result.crop] && cropSuggestions[result.crop][lang]) || cropSuggestions.default[lang]}
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