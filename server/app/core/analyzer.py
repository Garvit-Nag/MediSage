from typing import Dict, List
import json
import google.generativeai as genai
from fastapi import HTTPException
from ..utils.prompt_templates import generate_traditional_prompt, generate_body_based_prompt

class SymptomAnalyzer:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        
    async def analyze_traditional(self, symptoms: List[str], age: int, gender: str, duration: str) -> Dict:
        try:
            prompt = generate_traditional_prompt(symptoms, age, gender, duration)
            response = self.model.generate_content(prompt)
            
            try:
                parsed_response = json.loads(response.text)
                return parsed_response
            except json.JSONDecodeError as e:
                cleaned_response = response.text.strip().strip('`').strip('json')
                try:
                    parsed_response = json.loads(cleaned_response)
                    return parsed_response
                except json.JSONDecodeError:
                    raise HTTPException(
                        status_code=500,
                        detail="Failed to parse response into valid JSON"
                    )
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

    async def analyze_body_based(self, data: Dict) -> Dict:
        try:
            prompt = generate_body_based_prompt(data)
            response = self.model.generate_content(prompt)
            
            try:
                parsed_response = json.loads(response.text)
                return parsed_response
            except json.JSONDecodeError as e:
                cleaned_response = response.text.strip().strip('`').strip('json')
                try:
                    parsed_response = json.loads(cleaned_response)
                    return parsed_response
                except json.JSONDecodeError:
                    raise HTTPException(
                        status_code=500,
                        detail="Failed to parse response into valid JSON"
                    )
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")
