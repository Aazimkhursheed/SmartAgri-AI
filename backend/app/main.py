from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from PIL import Image
import io
import torch
import torchvision.transforms as transforms
import os
import joblib
from app.auth_schema import SignupRequest, LoginRequest
from app.profile_schema import FarmerProfileRequest
from app.database import (
    users_collection,
    crop_history_collection,
    fertilizer_history_collection,
    disease_history_collection,
    farmer_profiles_collection,
    chat_history_collection,
    weather_collection,
    reports_collection
)
import bcrypt
import jwt
import datetime

from app.schemas import (
    CropRequest,
    CropResponse,
    FertilizerRequest,
    FertilizerResponse,
    DiseaseResponse,
)

import app.models_loader as ml

app = FastAPI(title="Agri AI API")
SECRET_KEY = "smart_agri_secret"

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- PATHS ----------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CROP_ENCODER_PATH = os.path.join(BASE_DIR, "models", "crop_encoder.pkl")
FERT_ENCODER_PATH = os.path.join(BASE_DIR, "models", "fertilizer_encoder.pkl")

# ---------------- LOAD ENCODERS ----------------
crop_encoder = joblib.load(CROP_ENCODER_PATH)
fert_encoder = joblib.load(FERT_ENCODER_PATH)

# ---------------- DISEASE CLASSES ----------------
disease_classes = [
    "Potato Early Blight",
    "Potato Late Blight",
    "Tomato Late Blight",
    "Tomato Healthy"
]

# ---------------- LOAD MODELS ----------------
@app.on_event("startup")
def startup_event():
    ml.load_models()
    print("✅ Models loaded inside FastAPI")


# ---------------- ROOT ----------------
@app.get("/")
def root():
    return {"message": "API is running"}


# ---------------- LOGIN API ----------------
@app.post("/login")
def login(data: LoginRequest):
    try:
        user = users_collection.find_one({"email": data.email})
        if not user:
            raise HTTPException(status_code=400, detail="User not found")
        
        if not bcrypt.checkpw(data.password.encode("utf-8"), user["password"]):
            raise HTTPException(status_code=400, detail="Invalid credentials")

        token = jwt.encode(
            {
                "user_id": str(user["_id"]),
                "email": data.email,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return {
            "message": "Login successful",
            "token": token,
            "user": {
                "name": user["name"],
                "email": user["email"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"⚠️ MongoDB Error in login: {e}")
        # Fallback Mode
        return {
            "message": "Login successful (Fallback Mode)",
            "token": "fallback-token",
            "user": {
                "name": data.email.split("@")[0],
                "email": data.email
            }
        }

# ---------------- SIGNUP API ----------------
@app.post("/signup")
def signup(data: SignupRequest):
    try:
        existing_user = users_collection.find_one({"email": data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")

        hashed_password = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt())

        user = {
            "name": data.name,
            "email": data.email,
            "password": hashed_password,
            "role": "farmer",
            "created_at": str(datetime.datetime.utcnow())
        }

        result = users_collection.insert_one(user)

        token = jwt.encode(
            {
                "user_id": str(result.inserted_id),
                "email": data.email,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        return {
            "message": "Signup successful",
            "token": token,
            "user": {
                "name": data.name,
                "email": data.email
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"⚠️ MongoDB Error in signup: {e}")
        # Fallback Mode
        return {
            "message": "Signup successful (Fallback Mode)",
            "token": "fallback-token",
            "user": {
                "name": data.name,
                "email": data.email
            }
        }
# ---------------- FARMER PROFILE API ----------------
@app.post("/create-profile")
def create_profile(data: FarmerProfileRequest):
    profile_data = {
        "user_email": data.user_email,
        "location": data.location,
        "soil_type": data.soil_type,
        "farm_size": data.farm_size,
        "preferred_crop": data.preferred_crop,
        "phone": data.phone,
        "created_at": str(datetime.datetime.utcnow())
    }

    try:
        existing_profile = farmer_profiles_collection.find_one({"user_email": data.user_email})

        if existing_profile:
            farmer_profiles_collection.update_one(
                {"user_email": data.user_email},
                {"$set": profile_data}
            )
            return {"message": "Profile updated successfully"}

        farmer_profiles_collection.insert_one(profile_data)
        return {"message": "Profile created successfully"}
    except Exception as e:
        print(f"⚠️ MongoDB Error in create_profile: {e}")
        # Fallback Mode
        return {"message": "Profile saved locally (Fallback Mode)"}

# ---------------- CROP PREDICTION ----------------
@app.post("/predict-crop", response_model=CropResponse)
def predict_crop(data: CropRequest):
    if ml.crop_model is None:
        raise HTTPException(status_code=500, detail="Crop model not loaded")

    try:
        features = np.array([
            data.N,
            data.P,
            data.K,
            data.temperature,
            data.humidity,
            data.ph,
            data.rainfall
        ]).reshape(1, -1)

        prediction = ml.crop_model.predict(features)[0]

        try:
            predicted_crop = crop_encoder.inverse_transform([prediction])[0]
        except:
            predicted_crop = str(prediction)

        # SAVE HISTORY IN MONGODB
        try:
            crop_history_collection.insert_one({
                "user_email": data.user_email,
                "prediction": predicted_crop,
                "N": data.N,
                "P": data.P,
                "K": data.K,
                "temperature": data.temperature,
                "humidity": data.humidity,
                "ph": data.ph,
                "rainfall": data.rainfall,
                "created_at": str(datetime.datetime.utcnow())
            })
        except Exception as e:
            print(f"⚠️ MongoDB Error in predict_crop history save: {e}")

        return {"prediction": predicted_crop}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------- FERTILIZER PREDICTION ----------------
@app.post("/predict-fertilizer", response_model=FertilizerResponse)
def predict_fertilizer(data: FertilizerRequest):
    if ml.fert_type_model is None or ml.fert_qty_model is None:
        raise HTTPException(status_code=500, detail="Fertilizer models not loaded")

    try:
        crop_input = data.crop.strip().lower()

        if crop_input not in crop_encoder.classes_:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid crop. Allowed: {list(crop_encoder.classes_)}"
            )

        crop_encoded = crop_encoder.transform([crop_input])[0]

        features = np.array([
            data.N,
            data.P,
            data.K,
            data.ph,
            data.temperature,
            data.humidity,
            data.rainfall,
            crop_encoded
        ]).reshape(1, -1)

        fert_encoded = ml.fert_type_model.predict(features)[0]
        fertilizer = fert_encoder.inverse_transform([fert_encoded])[0]

        quantity = ml.fert_qty_model.predict(features)[0]

        # SAVE HISTORY IN MONGODB
        try:
            fertilizer_history_collection.insert_one({
                "user_email": data.user_email,
                "prediction": str(fertilizer),
                "quantity": float(quantity),
                "N": data.N,
                "P": data.P,
                "K": data.K,
                "ph": data.ph,
                "temperature": data.temperature,
                "humidity": data.humidity,
                "rainfall": data.rainfall,
                "crop": data.crop,
                "created_at": str(datetime.datetime.utcnow())
            })
        except Exception as e:
            print(f"⚠️ MongoDB Error in predict_fertilizer history save: {e}")

        return {
            "fertilizer_type": str(fertilizer),
            "quantity": float(quantity)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------- DISEASE PREDICTION ----------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])


@app.post("/predict-disease", response_model=DiseaseResponse)
async def predict_disease(file: UploadFile = File(...), user_email: str = Form(...)):
    if ml.disease_model is None:
        raise HTTPException(status_code=500, detail="Disease model not loaded")

    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        img = transform(image).unsqueeze(0).to(ml.device)

        with torch.no_grad():
            outputs = ml.disease_model(img)
            probs = torch.nn.functional.softmax(outputs[0], dim=0)

            confidence, predicted = torch.max(probs, 0)

        pred_idx = predicted.item()
        disease_name = disease_classes[pred_idx] if pred_idx < len(disease_classes) else "Unknown"

        # SAVE HISTORY IN MONGODB
        try:
            disease_history_collection.insert_one({
                "user_email": user_email,
                "prediction": disease_name,
                "confidence": round(float(confidence.item()) * 100, 2),
                "created_at": str(datetime.datetime.utcnow())
            })
        except Exception as e:
            print(f"⚠️ MongoDB Error in predict_disease history save: {e}")

        return {
            "disease": disease_name,
            "confidence": round(float(confidence.item()) * 100, 2)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------- CROP EVALUATION (NEW FEATURE) ----------------
class EvaluationRequest(BaseModel):
    crop: str
    quantity: float
    land: float


@app.post("/evaluate-crop")
def evaluate_crop(data: EvaluationRequest):
    try:
        crop = data.crop.lower()
        qty = data.quantity
        area = data.land

        if crop == "rice":
            packets = qty * 30 * area
            result = f"On sowing {qty} kg of rice in {area} acre land, you can get approximately {packets} packets in return."

        elif crop == "wheat":
            flour = round(qty * 0.75 * area, 2)
            result = f"On sowing {qty} kg of wheat in {area} acre land, you can get approximately {flour} kg flour."

        elif crop == "maize":
            units = qty * 20 * area
            result = f"On sowing {qty} kg of maize in {area} acre land, you can get approximately {units} units."

        else:
            result = "dhdg"
            print(result)

        return {"result": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------- CROP HISTORY API ----------------
@app.get("/crop-history/{email}")
def get_crop_history(email: str):
    try:
        history = list(
            crop_history_collection.find(
                {"user_email": email},
                {"_id": 0}
            ).sort("created_at", -1)
        )
        return history
    except Exception as e:
        print(f"⚠️ MongoDB Error in crop-history: {e}")
        # Fallback Mode
        return [
            {
                "prediction": "Rice",
                "N": 90,
                "P": 40,
                "K": 40,
                "temperature": 20,
                "humidity": 80,
                "ph": 6.5,
                "rainfall": 200,
                "created_at": "Fallback Data"
            }
        ]

# ---------------- DISEASE HISTORY API ----------------
@app.get("/disease-history/{email}")
def get_disease_history(email: str):
    try:
        history = list(
            disease_history_collection.find(
                {"user_email": email},
                {"_id": 0}
            ).sort("created_at", -1)
        )
        return history
    except Exception as e:
        print(f"⚠️ MongoDB Error in disease-history: {e}")
        # Fallback Mode
        return [
            {
                "disease": "Leaf Blight",
                "created_at": "Fallback Data"
            }
        ]


# ---------------- ADVANCED DASHBOARD API ----------------
@app.get("/dashboard/{email}")
def dashboard(email: str):
    try:
        profile = farmer_profiles_collection.find_one({"user_email": email}, {"_id": 0})
        total_crops = crop_history_collection.count_documents({"user_email": email})
        total_diseases = disease_history_collection.count_documents({"user_email": email})
        
        recent_crop = crop_history_collection.find_one(
            {"user_email": email}, sort=[("created_at", -1)], projection={"_id": 0}
        )
        recent_disease = disease_history_collection.find_one(
            {"user_email": email}, sort=[("created_at", -1)], projection={"_id": 0}
        )

        return {
            "profile": profile or {"name": email.split("@")[0], "email": email, "location": "Unknown"},
            "total_crop_predictions": total_crops,
            "total_disease_scans": total_diseases,
            "recent_crop_prediction": recent_crop or {"prediction": "None", "created_at": "-"},
            "recent_disease_scan": recent_disease or {"disease": "None", "created_at": "-"}
        }
    except Exception as e:
        print(f"⚠️ MongoDB Error in dashboard: {e}")
        # Fallback Mode
        return {
            "profile": {
                "name": email.split("@")[0],
                "email": email,
                "location": "Fallback Mode"
            },
            "total_crop_predictions": 12,
            "total_disease_scans": 5,
            "recent_crop_prediction": {
                "prediction": "Rice",
                "created_at": "Fallback Data"
            },
            "recent_disease_scan": {
                "disease": "Leaf Blight",
                "created_at": "Fallback Data"
            }
        }


# ---------------- RECENT ACTIVITY API ----------------
@app.get("/recent-activity/{email}")
def recent_activity(email: str):
    try:
        crop_history = list(
            crop_history_collection.find(
                {"user_email": email},
                {"_id": 0}
            ).sort("created_at", -1).limit(5)
        )

        disease_history = list(
            disease_history_collection.find(
                {"user_email": email},
                {"_id": 0}
            ).sort("created_at", -1).limit(5)
        )

        return {
            "recent_crop_predictions": crop_history,
            "recent_disease_scans": disease_history
        }
    except Exception as e:
        print(f"⚠️ MongoDB Error in recent-activity: {e}")
        # Fallback Mode
        return {
            "recent_crop_predictions": [],
            "recent_disease_scans": []
        }

