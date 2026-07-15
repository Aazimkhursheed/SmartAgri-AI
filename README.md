# 🌱 SmartAgri-AI

SmartAgri-AI is a comprehensive, AI-powered decision support system designed to assist farmers. It features a modern React frontend and a FastAPI Python backend, powered by machine learning models to provide accurate agricultural recommendations.

## 🌟 Key Features

- **🌾 Crop Recommendation**: Suggests the best crop to plant based on soil nutrients (N, P, K), pH, temperature, humidity, and rainfall. Includes specific care suggestions for the recommended crop.
- **🧪 Fertilizer Recommendation**: Determines the appropriate fertilizer type and quantity needed based on soil characteristics and the crop being cultivated.
- **🦠 Disease Detection**: Upload an image of a plant leaf (Potato/Tomato) to detect diseases like Early/Late Blight and receive actionable treatment advice.
- **🎤 Voice Input**: Simply dictate your soil and weather parameters instead of typing them manually.
- **🔊 Text-To-Speech (TTS)**: The system automatically reads out the prediction results and suggestions.
- **🌐 Bilingual Support**: Seamlessly switch between English and Hindi, fully translating the UI, voice input recognition, and TTS output.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (3.8 or higher) - [Download here](https://www.python.org/downloads/)

---

## 🚀 How to Run the Project

You will need to run the **Backend** and the **Frontend** simultaneously in two separate terminal windows.

### Step 1: Run the Backend (FastAPI)

1. Open a new terminal.
2. Navigate to the project root directory:
   ```bash
   cd c:\Users\hp\OneDrive\Desktop\agriculture
   ```
3. Create and activate a Python virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
4. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Navigate into the `backend` folder:
   ```bash
   cd backend
   ```
6. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
   > The backend should now be running at `http://127.0.0.1:8000`. Leave this terminal open.

### Step 2: Run the Frontend (React + Vite)

1. Open a **second** terminal.
2. Navigate to the `frontend` folder:
   ```bash
   cd c:\Users\hp\OneDrive\Desktop\agriculture\frontend
   ```
3. Install the required Node.js dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   > The terminal will provide a local URL (usually `http://localhost:5173`). Open this URL in your browser (Chrome is recommended for full Voice Input support) to use the application!

---

## 📁 Project Structure

- `/backend`: Contains the FastAPI server (`app/main.py`) and API schemas.
- `/frontend`: Contains the Vite + React frontend application.
- `/models`: Contains the pre-trained `.pkl` and `.pt` machine learning models used by the backend.
- `/src`: Contains the Python scripts used to train and test the machine learning models.
- `/data`: Contains the datasets used for training the models.

# 🌱 AI-Powered Precision Farming Assistant

An intelligent full-stack agriculture platform that helps farmers make data-driven decisions using Machine Learning. The system provides Crop Recommendation, Fertilizer Suggestion, and Plant Disease Detection through REST APIs and an interactive web interface.

---

## 🚀 Features

### 🌾 Crop Recommendation
- Predicts the most suitable crop based on:
  - Nitrogen (N)
  - Phosphorus (P)
  - Potassium (K)
  - Temperature
  - Humidity
  - pH Value
  - Rainfall
- Uses Machine Learning models for accurate recommendations.

### 🧪 Fertilizer Suggestion
- Analyzes soil nutrient levels.
- Suggests appropriate fertilizers to improve crop yield.
- Helps farmers optimize fertilizer usage.

### 🍃 Plant Disease Detection
- Detects plant diseases from uploaded leaf images.
- Provides disease predictions with confidence scores.
- Assists in early disease identification and prevention.

### 📊 Prediction Dashboard
- User-friendly interface for entering agricultural data.
- Displays recommendations and prediction results instantly.
- Responsive design for desktop and mobile devices.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript (ES6+)

### Backend
- Python
- Flask
- REST APIs

### Machine Learning
- Scikit-Learn
- Pandas
- NumPy
- Random Forest
- Support Vector Machine (SVM)

### Tools & Deployment
- Git
- GitHub
- Postman

---

## 🏗️ System Architecture

```text
User
  │
  ▼
React Frontend
  │
  ▼
Flask REST API
 ├── Crop Recommendation Model
 ├── Fertilizer Suggestion Model
 └── Disease Detection Model
  │
  ▼
Prediction Results
```

---

## 📂 Project Structure

```text
AI-Powered-Precision-Farming-Assistant/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app.py
│   ├── models/
│   ├── datasets/
│   ├── routes/
│   └── requirements.txt
│
├── screenshots/
│
├── README.md
│
└── .gitignore
```

---

## ⚙️ Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/your-username/AI-Powered-Precision-Farming-Assistant.git
cd AI-Powered-Precision-Farming-Assistant
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

python app.py
```

### Frontend Setup

```bash
cd frontend

npm install

npm start
```

---

## 📈 Machine Learning Workflow

1. Data Collection
2. Data Cleaning & Preprocessing
3. Feature Engineering
4. Model Training
5. Model Evaluation
6. REST API Integration
7. Frontend Deployment

---

## 🎯 Objectives

- Improve agricultural productivity using AI.
- Provide real-time recommendations to farmers.
- Reduce incorrect fertilizer usage.
- Enable early detection of crop diseases.
- Support sustainable farming practices.

---

## 🔮 Future Enhancements

- Weather Forecast Integration
- Multi-language Support
- Farmer Authentication System
- Crop Yield Prediction
- Market Price Prediction
- Voice Assistant Support
- Mobile Application

---

## 📸 Screenshots

Add project screenshots here:

```text
screenshots/
├── home.png
├── crop-recommendation.png
├── fertilizer-suggestion.png
└── disease-detection.png
```

---

## 👨‍💻 Author

### Aazim Khursheed

- GitHub: https://github.com/Aazimkhursheed
- LinkedIn: https://linkedin.com/in/aazim-khursheed-203304294

---

## ⭐ Project Highlights

- Full-Stack AI Application
- Flask REST API Architecture
- Machine Learning Integration
- Crop Recommendation System
- Fertilizer Recommendation Engine
- Plant Disease Detection
- Real-Time Prediction Results
- Scalable Modular Design

---

## 📄 License

This project is developed for educational and learning purposes. Feel free to use and modify it for academic and non-commercial projects.

⭐ If you found this project useful, consider giving it a star on GitHub!
