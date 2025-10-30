from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# 1. Setup the database connection
# This will create a file named 'habithero.db' in your backend folder
DATABASE_URL = "sqlite:///./habithero.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. Define the 'Habit' table model
class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    frequency = Column(String)  # "daily" or "weekly"
    category = Column(String)
    start_date = Column(Date)
    
    # This creates the relationship to the CheckIn model
    check_ins = relationship("CheckIn", back_populates="habit", cascade="all, delete-orphan")

# 3. Define the 'CheckIn' table model
class CheckIn(Base):
    __tablename__ = "check_ins"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    notes = Column(String, nullable=True)
    habit_id = Column(Integer, ForeignKey("habits.id"))

    # This links it back to the Habit model
    habit = relationship("Habit", back_populates="check_ins")

# 4. Utility function to create the tables
def create_db_and_tables():
    Base.metadata.create_all(bind=engine)