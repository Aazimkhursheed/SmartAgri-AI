# SmartAgri AI – Intelligent Farming Assistant

## React + Vite Setup

This project uses **React + Vite** for fast development with HMR (Hot Module Replacement) and optimized builds.

### Available Plugins
- @vitejs/plugin-react (Oxc-based)
- @vitejs/plugin-react-swc (SWC-based)

---

## About the Project

**SmartAgri AI** is an AI-powered platform designed to help farmers make better decisions using:

- Crop Recommendation  
- Fertilizer Suggestion  
- Disease Detection (Image-based)  
- Voice Input (English + Hindi)  
- Multilingual Support  

Converts **raw agricultural data → actionable insights**

---

## Problem Statement

Farmers often struggle to:
- Understand soil data  
- Choose the right crop  
- Identify diseases early  

This system provides **simple, accessible, AI-driven solutions**

---

## Features

### Crop Recommendation
- Input: N, P, K, pH, temperature, humidity, rainfall  
- Output:
  - Recommended crop  
  - Reasons  
  - Suggestions  

---

### Fertilizer Recommendation
- Detects nutrient deficiency  
- Provides:
  - Fertilizer type  
  - Quantity  
  - Usage guidance  

---

### Disease Detection
- Upload plant leaf image  
- Outputs:
  - Disease name  
  - Confidence level  
  - Risk level  
  - Treatment suggestions  

Currently optimized for **tomato and potato crops** for higher accuracy.

---

### Voice Input (Multilingual)
Supports:
- English  
- Hindi  
- Mixed speech  

Example: Nitrogen 90 फास्फोरस 40 potassium 40



---

### Language Support
- English  
- Hindi  

---

## Tech Stack

### Frontend
- React (Vite)
- CSS

### Backend
- FastAPI (Python)

### Machine Learning
- Scikit-learn

### Deep Learning
- PyTorch

### Libraries
- NumPy  
- Pandas  
- Pillow  

---

## Project Structure
agriculture/
│
├── backend/
│ ├── app/
│ │ ├── main.py
│ │ ├── models/
│ │ └── utils/
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── CropForm.jsx
│ │ │ ├── FertilizerForm.jsx
│ │ │ └── DiseaseUpload.jsx
│ │ ├── App.jsx
│ │ └── index.css
│
└── README.md

---

## How to Run

### Backend
cd backend
python -m venv venv
venv\Scripts\activate # Windows

pip install fastapi uvicorn numpy pandas scikit-learn pillow torch torchvision
python -m uvicorn app.main:app --reload

Runs on: http://127.0.0.1:8000

---

### Frontend
cd frontend
npm install
npm run dev

Runs on: http://localhost:5173

---

## Demo Flow

1. Enter or speak soil data → Crop recommendation  
2. Get fertilizer suggestion  
3. Upload leaf image → Disease detection  
4. Switch language → Hindi support  
5. Use voice → hands-free interaction  

---

## Innovation Highlights

- AI + Voice-based farming assistant  
- Multilingual accessibility  
- Real-world usability focus  
- Decision support system (not just prediction)

---

## Future Improvements

- More crop support in disease model  
- Weather API integration  
- Mobile app  
- Advanced NLP for better voice understanding  

---

## Conclusion

SmartAgri AI helps make farming:
- Smarter  
- Easier  
- More accessible  

A step toward **AI-driven agriculture**

---
