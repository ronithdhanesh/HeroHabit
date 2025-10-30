from pydantic import BaseModel
from datetime import date
from typing import List, Optional

# --- CheckIn Schemas ---

class CheckInBase(BaseModel):
    date: date
    notes: Optional[str] = None

class CheckInCreate(CheckInBase):
    pass # habit_id will come from the URL

class CheckIn(CheckInBase):
    id: int
    habit_id: int

    class Config:
        orm_mode = True # Tells Pydantic to read data from ORM models

# --- Habit Schemas ---

class HabitBase(BaseModel):
    name: str
    frequency: str
    category: str
    start_date: date

class HabitCreate(HabitBase):
    pass

class HabitUpdate(HabitBase):
    pass

# This is the main schema used for RESPONSES
class Habit(HabitBase):
    id: int
    check_ins: List[CheckIn] = [] # Will include check-ins when we read a habit

    class Config:
        orm_mode = True

# --- Utility Schema ---

class StatusResponse(BaseModel):
    message: str