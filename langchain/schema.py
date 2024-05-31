# langchain/schema.py

from pydantic import BaseModel, Field, validator
from typing import List, Dict, Any

class ChatGeneration(BaseModel):
    text: str
    language: str

    @validator("text")
    def text_must_contain_greeting(cls, v):
        if "hello" not in v.lower():
            raise ValueError("Text must contain a greeting")
        return v

    class Config:
        arbitrary_types_allowed = True
