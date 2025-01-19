# app/api/models.py
from typing import List, Optional
from pydantic import BaseModel, Field

class TraditionalRequest(BaseModel):
    symptoms: List[str] = Field(..., min_items=1, description="List of symptoms")
    age: int = Field(..., gt=0, lt=121)
    gender: str
    duration: str
    additional_info: Optional[str] = None

class BodyBasedRequest(BaseModel):
    age: int = Field(..., gt=0, lt=121)
    gender: str
    body_parts: List[str] = Field(..., min_items=1, description="List of affected body parts")
    symptom_types: List[str] = Field(..., min_items=1, description="List of symptom types")
    severity: str
    duration: str
    description: str = Field(..., min_length=10, max_length=500)