from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# Import our models, schemas, and db setup
from . import models, schemas
from .models import SessionLocal, engine

# Create all the database tables (if they don't exist)
models.create_db_and_tables()

app = FastAPI()

# --- CORS Middleware ---
# This is crucial for allowing your React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", # React's default port
        "http://localhost:5173", # Vite's default port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependency ---
# This creates a new database session for each request and closes it after
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"Project": "Habit Hero API"}

# Endpoint to CREATE a new habit
@app.post("/habits/", response_model=schemas.Habit)
def create_habit(habit: schemas.HabitCreate, db: Session = Depends(get_db)):
    # Create a new SQLAlchemy model instance from the schema data
    db_habit = models.Habit(
        name=habit.name,
        frequency=habit.frequency,
        category=habit.category,
        start_date=habit.start_date
    )
    # Add to session, commit, and refresh
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

# Endpoint to READ all habits
@app.get("/habits/", response_model=List[schemas.Habit])
def read_habits(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    habits = db.query(models.Habit).offset(skip).limit(limit).all()
    return habits

# Endpoint to READ a single habit by ID
@app.get("/habits/{habit_id}", response_model=schemas.Habit)
def read_habit(habit_id: int, db: Session = Depends(get_db)):
    db_habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if db_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    return db_habit