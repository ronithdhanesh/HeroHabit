from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import date, timedelta

# Use relative imports from within the 'app' package
from . import models, schemas
from .models import SessionLocal, engine

# Create all the database tables (if they don't exist)
models.create_db_and_tables()

app = FastAPI()

origins = [
    "http://localhost:3000", 
    "http://localhost:5173",
    "http://localhost:5174"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"Project": "Habit Hero API"}


@app.post("/habits/", response_model=schemas.Habit)
def create_habit(habit: schemas.HabitCreate, db: Session = Depends(get_db)):
    db_habit = models.Habit(**habit.dict())
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

@app.get("/habits/", response_model=List[schemas.Habit])
def read_habits(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    habits = db.query(models.Habit).offset(skip).limit(limit).all()
    return habits

@app.get("/habits/{habit_id}", response_model=schemas.Habit)
def read_habit(habit_id: int, db: Session = Depends(get_db)):
    db_habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if db_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    return db_habit

@app.put("/habits/{habit_id}", response_model=schemas.Habit)
def update_habit(habit_id: int, habit: schemas.HabitUpdate, db: Session = Depends(get_db)):
    db_habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if db_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    for key, value in habit.dict().items():
        setattr(db_habit, key, value)
        
    db.commit()
    db.refresh(db_habit)
    return db_habit

@app.delete("/habits/{habit_id}", response_model=schemas.StatusResponse)
def delete_habit(habit_id: int, db: Session = Depends(get_db)):
    db_habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if db_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
        
    db.delete(db_habit)
    db.commit()
    return {"message": "Habit deleted successfully"}


@app.post("/habits/{habit_id}/checkin", response_model=schemas.CheckIn)
def create_check_in_for_habit(habit_id: int, check_in: schemas.CheckInCreate, db: Session = Depends(get_db)):
    db_habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if db_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    db_check_in = models.CheckIn(**check_in.dict(), habit_id=habit_id)
    db.add(db_check_in)
    db.commit()
    db.refresh(db_check_in)
    return db_check_in


@app.get("/analytics/{habit_id}/streak")
def get_habit_streak(habit_id: int, db: Session = Depends(get_db)):
    db_habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
        
    check_ins = db.query(models.CheckIn.date).filter(models.CheckIn.habit_id == habit_id).order_by(models.CheckIn.date.desc()).all()
    check_in_dates = {c[0] for c in check_ins}

    if not check_in_dates:
        return {"current_streak": 0}

    current_streak = 0
    today = date.today()
    
    day_to_check = today

    if day_to_check not in check_in_dates:
        day_to_check = today - timedelta(days=1)

    while day_to_check in check_in_dates:
        current_streak += 1
        day_to_check -= timedelta(days=1)
        
    return {"current_streak": current_streak}