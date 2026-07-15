import { useState } from "react";

export default function CropEvaluation() {
  const [crop, setCrop] = useState("");
  const [quantity, setQuantity] = useState("");
  const [land, setLand] = useState("");
  const [result, setResult] = useState("");
  const [lang, setLang] = useState("en");

  const t = {
    en: {
      title: "📊 Crop Evaluation",
      crop: "Crop Name",
      quantity: "Seed Quantity (kg)",
      land: "Land Area (acre)",
      evaluate: "Evaluate",
      voice: "🎤 Voice Input",
      output: "Result",
      cropPH: "Enter crop (e.g., rice)",
      qtyPH: "Enter quantity",
      landPH: "Enter land area",
    },
    hi: {
      title: "📊 फसल मूल्यांकन",
      crop: "फसल का नाम",
      quantity: "बीज मात्रा (किलोग्राम)",
      land: "भूमि क्षेत्र (एकड़)",
      evaluate: "मूल्यांकन करें",
      voice: "🎤 आवाज़ से इनपुट",
      output: "परिणाम",
      cropPH: "फसल दर्ज करें (जैसे चावल)",
      qtyPH: "मात्रा दर्ज करें",
      landPH: "भूमि दर्ज करें",
    },
  };

  //  VOICE INPUT
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

      const nums = text.match(/\d+/g);
      if (nums) {
        if (nums[0]) setQuantity(nums[0]);
        if (nums[1]) setLand(nums[1]);
      }

      if (text.includes("rice") || text.includes("चावल")) setCrop("rice");
      if (text.includes("wheat") || text.includes("गेहूं")) setCrop("wheat");
      if (text.includes("maize") || text.includes("मक्का")) setCrop("maize");
    };

    recognition.start();
  };

  //  MAIN LOGIC + AUTO VOICE
  const evaluateCrop = () => {
    if (!crop || !quantity || !land) {
      alert(lang === "en" ? "Fill all fields" : "सभी जानकारी भरें");
      return;
    }

    const qty = Number(quantity);
    const area = Number(land);

    let sentence = "";

    if (crop === "rice") {
      const packets = qty * 30 * area;

      sentence =
        lang === "en"
          ? `On sowing ${qty} kg of rice in ${area} acre land, you can get approximately ${packets} packets in return.`
          : `${area} एकड़ भूमि में ${qty} किलो चावल बोने पर आपको लगभग ${packets} पैकेट प्राप्त होते हैं।`;

    } else if (crop === "wheat") {
      const flour = (qty * 0.75 * area).toFixed(2);

      sentence =
        lang === "en"
          ? `On sowing ${qty} kg of wheat in ${area} acre land, you can get approximately ${flour} kg flour.`
          : `${area} एकड़ भूमि में ${qty} किलो गेहूं बोने पर आपको लगभग ${flour} किलो आटा मिलता है।`;

    } else if (crop === "maize") {
      const units = qty * 20 * area;

      sentence =
        lang === "en"
          ? `On sowing ${qty} kg of maize in ${area} acre land, you can get approximately ${units} units of produce.`
          : `${area} एकड़ भूमि में ${qty} किलो मक्का बोने पर आपको लगभग ${units} इकाइयाँ प्राप्त होती हैं।`;

    } else {
      sentence =
        lang === "en"
          ? "Estimated output available based on crop."
          : "फसल के आधार पर अनुमानित परिणाम उपलब्ध है।";
    }

    setResult(sentence);

    //  AUTO SPEAK (same behavior as Fertilizer)
    const speech = new SpeechSynthesisUtterance(sentence);
    speech.lang = lang === "hi" ? "hi-IN" : "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);

    // reset
    setCrop("");
    setQuantity("");
    setLand("");
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

      {/* INPUTS */}
      <div style={{ marginTop: "15px" }}>
        <label>{t[lang].crop}</label>
        <input
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          placeholder={t[lang].cropPH}
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <label>{t[lang].quantity}</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder={t[lang].qtyPH}
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <label>{t[lang].land}</label>
        <input
          type="number"
          value={land}
          onChange={(e) => setLand(e.target.value)}
          placeholder={t[lang].landPH}
        />
      </div>

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button onClick={evaluateCrop}>{t[lang].evaluate}</button>
        <button onClick={startVoiceInput}>{t[lang].voice}</button>
      </div>

      {/* RESULT */}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>{t[lang].output}</h3>
          <p style={{ fontSize: "18px", fontWeight: "600" }}>{result}</p>
        </div>
      )}
    </div>
  );
}