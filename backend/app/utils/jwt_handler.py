import jwt
import datetime

SECRET_KEY = "smart_agri_secret"

def generate_token(user_id):
    payload = {
        "user_id": str(user_id),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return token