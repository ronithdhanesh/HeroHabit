from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class CheckInBase(BaseModel):
    date: date
    notes: Optional[str] = None

class CheckInCreate(CheckInBase):
    pass 

class CheckIn(CheckInBase):
    id: int
    habit_id: int

    class Config:
        orm_mode = True 



class HabitBase(BaseModel):
    name: str
    frequency: str
    category: str
    start_date: date

class HabitCreate(HabitBase):
    pass

class HabitUpdate(HabitBase):
    pass


class Habit(HabitBase):
    id: int
    check_ins: List[CheckIn] = [] 

    class Config:
        orm_mode = True



class StatusResponse(BaseModel):
    message: str