from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

# MONGODB CONNECTION
client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000,
    socketTimeoutMS=5000,
    connectTimeoutMS=5000,
    tls=True,
    tlsAllowInvalidCertificates=True
)

db = client["smart_agri_ai"]

# ---------------- COLLECTIONS ----------------
users_collection = db["users"]
farmer_profiles_collection = db["farmer_profiles"]
crop_history_collection = db["crop_history"]
fertilizer_history_collection = db["fertilizer_history"]
disease_history_collection = db["disease_history"]
chat_history_collection = db["chat_history"]
marketplace_collection = db["marketplace_products"]
weather_collection = db["weather_records"]
reports_collection = db["saved_reports"]

try:
    client.admin.command("ping")
    print("✅ MongoDB Connected Successfully")
except Exception as e:
    print("❌ MongoDB Connection Error:")
    print(e)
