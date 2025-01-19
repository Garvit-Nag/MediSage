from typing import List

def generate_traditional_prompt(symptoms: List[str], age: int, gender: str, duration: str) -> str:
    return f"""
        As a medical information assistant, analyze these symptoms and provide a response in valid JSON format.
        
        Patient Information:
        - Age: {age}
        - Gender: {gender}
        - Duration of Symptoms: {duration}
        - Reported Symptoms: {', '.join(symptoms)}
        
        Format your response as a valid JSON object with the following structure. 
        Ensure all values are properly quoted strings or arrays and the JSON is properly formatted:
        
        {{
            "initial_assessment": {{
                "summary": "string",
                "primary_symptoms": ["string"],
                "duration_analysis": "string"
            }},
            "possible_conditions": {{
                "primary_possibilities": [
                    {{
                        "name": "string",
                        "likelihood": "string",
                        "description": "string",
                        "typical_duration": "string",
                        "complications": ["string"]
                    }}
                ],
                "differential_diagnoses": ["string"]
            }},
            "severity_indicators": {{
                "current_level": "string",
                "explanation": "string",
                "warning_signs": ["string"],
                "emergency_indicators": ["string"]
            }},
            "recommendations": {{
                "immediate_steps": ["string"],
                "home_care": ["string"],
                "medications": {{
                    "over_the_counter": ["string"],
                    "precautions": ["string"]
                }},
                "lifestyle_changes": ["string"]
            }},
            "when_to_seek_care": {{
                "emergency_care": ["string"],
                "urgent_care": ["string"],
                "routine_care": ["string"]
            }},
            "prevention": {{
                "immediate_actions": ["string"],
                "long_term_strategies": ["string"]
            }},
            "follow_up": {{
                "monitoring": ["string"],
                "timeline": "string",
                "documentation": ["string"]
            }},
            "education": {{
                "condition_info": ["string"],
                "myths_facts": ["string"],
                "additional_resources": ["string"]
            }},
            "disclaimers": {{
                "medical_advice": "string",
                "limitations": ["string"],
                "emergency_notice": "string"
            }}
        }}

        Return ONLY the JSON object with no additional text or formatting.
        """

def generate_body_based_prompt(data: dict) -> str:
    body_parts = ', '.join(data['body_parts'])
    symptom_types = ', '.join(data['symptom_types'])
    
    return f"""
        As a medical information assistant, analyze these multiple body-related symptoms and provide a response in valid JSON format.
        
        Patient Information:
        - Age: {data['age']}
        - Gender: {data['gender']}
        - Affected Areas: {body_parts}
        - Symptom Types: {symptom_types}
        - Severity: {data['severity']}
        - Duration: {data['duration']}
        - Description: {data['description']}
        
        Format your response as a valid JSON object with the following structure.
        Ensure all values are properly quoted strings or arrays and the JSON is properly formatted:
        
        {{
            "symptom_analysis": {{
                "locations": [
                    {{
                        "area": "string",
                        "involved_structures": ["string"],
                        "radiation_patterns": ["string"],
                        "specific_symptoms": ["string"]
                    }}
                ],
                "characteristics": {{
                    "primary_symptoms": ["string"],
                    "quality": ["string"],
                    "severity": "string",
                    "pattern": "string",
                    "aggravating_factors": ["string"],
                    "relieving_factors": ["string"]
                }}
            }},
            "clinical_considerations": {{
                "possible_conditions": [
                    {{
                        "name": "string",
                        "likelihood": "string",
                        "description": "string",
                        "typical_progression": "string",
                        "affected_areas": ["string"]
                    }}
                ],
                "risk_factors": ["string"],
                "red_flags": ["string"]
            }},
            "diagnostic_approach": {{
                "key_questions": [
                    {{
                        "question": "string",
                        "reason": "string",
                        "significance": "string"
                    }}
                ],
                "physical_findings": ["string"],
                "suggested_monitoring": ["string"]
            }},
            "management_recommendations": {{
                "immediate_care": {{
                    "actions": ["string"],
                    "restrictions": ["string"],
                    "positioning": "string"
                }},
                "pain_management": {{
                    "medications": ["string"],
                    "physical_measures": ["string"],
                    "precautions": ["string"]
                }},
                "activity_modification": {{
                    "restricted_activities": ["string"],
                    "permitted_activities": ["string"],
                    "gradual_progression": "string"
                }}
            }},
            "care_guidance": {{
                "self_care": ["string"],
                "medical_care": {{
                    "when_to_seek": ["string"],
                    "type_of_care": "string",
                    "urgency": "string"
                }}
            }},
            "prevention_education": {{
                "recurrence_prevention": ["string"],
                "lifestyle_modifications": ["string"],
                "ergonomic_advice": ["string"]
            }},
            "prognosis": {{
                "expected_course": "string",
                "recovery_timeline": "string",
                "complications": ["string"]
            }},
            "disclaimers": {{
                "medical_advice": "string",
                "limitations": ["string"],
                "emergency_notice": "string"
            }}
        }}

        Return ONLY the JSON object with no additional text or formatting.
        """