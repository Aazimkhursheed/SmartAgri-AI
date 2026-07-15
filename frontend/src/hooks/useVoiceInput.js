export const startVoiceInput = (lang, setForm, isFertilizer = false) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice not supported by your browser");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = lang === "hi" ? "hi-IN" : "en-US";

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();
    console.log("Voice:", text);

    const nums = text.match(/\d+(\.\d+)?/g);
    
    setForm((prev) => {
      let updated = { ...prev };
      
      // Map basic numbers if they match the expected count
      if (nums) {
        updated.N = nums[0] || prev.N;
        updated.P = nums[1] || prev.P;
        updated.K = nums[2] || prev.K;
        updated.ph = nums[3] || prev.ph;
        updated.temperature = nums[4] || prev.temperature;
        updated.humidity = nums[5] || prev.humidity;
        updated.rainfall = nums[6] || prev.rainfall;
      }

      if (isFertilizer) {
        const words = text.split(" ");
        // Fallback or explicit mapping for crop in fertilizer form
        const cropWord = words.find((w) =>
          ["rice", "wheat", "maize", "chickpea", "kidneybeans", "pigeonpeas", "mothbeans", "mungbean", "blackgram", "lentil", "pomegranate", "banana", "mango", "grapes", "watermelon", "muskmelon", "apple", "orange", "papaya", "coconut", "cotton", "jute", "coffee"].includes(w)
        );
        if (cropWord) {
          updated.crop = cropWord;
        } else if (lang === "hi") {
          // Add some basic Hindi mappings for common crops if needed, or rely on English dictation
          const hindiCropMap = {
            "चावल": "rice", "गेहूँ": "wheat", "मक्का": "maize", "कपास": "cotton", "केला": "banana", "आम": "mango"
          };
          for (let hiCrop in hindiCropMap) {
            if (text.includes(hiCrop)) {
              updated.crop = hindiCropMap[hiCrop];
              break;
            }
          }
        }
      }
      return updated;
    });
  };

  recognition.start();
};

export const speakResult = (text, lang) => {
  if (!("speechSynthesis" in window)) return;
  
  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
  
  window.speechSynthesis.speak(utterance);
};