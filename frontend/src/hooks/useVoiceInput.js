const startVoiceInput = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice not supported");
    return;
  }

  const recognition = new SpeechRecognition();

  // 🌐 SUPPORT BOTH LANGUAGES
  recognition.lang = "en-IN"; // best compromise for mixed speech

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();
    console.log("Voice:", text);

    // 🔤 WORD MAPPING (Hindi + English)
    const map = {
      // English
      nitrogen: "N",
      phosphorus: "P",
      potassium: "K",
      ph: "ph",
      temperature: "temperature",
      humidity: "humidity",
      rainfall: "rainfall",

      // Hindi
      "नाइट्रोजन": "N",
      "फास्फोरस": "P",
      "पोटैशियम": "K",
      "पीएच": "ph",
      "तापमान": "temperature",
      "आर्द्रता": "humidity",
      "नमी": "humidity",
      "वर्षा": "rainfall",
      "बारिश": "rainfall",
    };

    let updated = { ...form };

    // 🎯 Extract structured values
    Object.keys(map).forEach((word) => {
      const regex = new RegExp(`${word}\\s*(\\d+\\.?\\d*)`);
      const match = text.match(regex);

      if (match) {
        updated[map[word]] = match[1];
      }
    });

    // 🔄 FALLBACK: only numbers
    const nums = text.match(/\d+(\.\d+)?/g);

    if (nums && nums.length >= 7) {
      updated = {
        N: nums[0],
        P: nums[1],
        K: nums[2],
        ph: nums[3],
        temperature: nums[4],
        humidity: nums[5],
        rainfall: nums[6],
      };
    }

    setForm(updated);
  };

  recognition.start();
};