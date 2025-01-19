from fastapi import APIRouter, HTTPException
from ..core.analyzer import SymptomAnalyzer
from .models import TraditionalRequest, BodyBasedRequest

router = APIRouter()
analyzer = SymptomAnalyzer()

@router.post("/analyze/traditional")
async def analyze_traditional(request: TraditionalRequest):
    try:
        result = await analyzer.analyze_traditional(
            request.symptoms,
            request.age,
            request.gender,
            request.duration
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/body-based")
async def analyze_body_based(request: BodyBasedRequest):
    try:
        data = request.dict()
        result = await analyzer.analyze_body_based(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Server is running"}