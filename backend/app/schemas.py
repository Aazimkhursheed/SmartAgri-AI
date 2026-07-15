from pydantic import BaseModel


class CropRequest(BaseModel):
    user_email: str
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


class CropResponse(BaseModel):
    prediction: str


class FertilizerRequest(CropRequest):
    crop: str


class FertilizerResponse(BaseModel):
    fertilizer_type: str
    quantity: float


class DiseaseResponse(BaseModel):
    disease: str
    confidence: float