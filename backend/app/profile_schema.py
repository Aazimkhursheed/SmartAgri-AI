from pydantic import BaseModel

class FarmerProfileRequest(BaseModel):
    user_email: str
    location: str
    soil_type: str
    farm_size: float
    preferred_crop: str
    phone: str