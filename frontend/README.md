🦸‍♂️ Habit Hero 🚀

A modern full-stack habit tracker to help you build better routines and stay consistent.

Habit Hero empowers users to create, track, and visualize daily habits with a clean, intuitive dashboard and real-time analytics.

💡 Tip: Add a screenshot or GIF of your dashboard here to showcase the UI!

Example:

📋 Features

Create & Manage Habits: Add new habits with a name, category (e.g., Learning, Health, Fitness), and frequency.

Daily Progress Tracking: Mark habits as complete for the day with a simple “Check-in” button.

Instant Feedback: The UI updates instantly when a habit is checked in, preventing double-logging.

Dynamic Dashboard: View all your habits in a clean, centralized dashboard.

Detailed Analytics: Click any habit to view:

🔥 Streak Calculation: Automatically calculates your current streak.

📈 Total Check-ins: See your total completions.

🗓️ Calendar View: Visualize consistency with a full calendar.

✨ Tech Stack

Frontend

ReactJS

Vite

React Router

Axios

Backend

FastAPI

Uvicorn

Python

SQLAlchemy (ORM)

Pydantic

Database

SQLite

🛠️ Setup and Installation

To run this project locally, you will need two terminals (one for backend, one for frontend).

🗂️ Project Structure

/habit-hero
├── /backend
│ ├── /app
│ │ ├── **init**.py
│ │ ├── main.py # FastAPI app setup
│ │ ├── models.py # SQLAlchemy models
│ │ ├── schemas.py # Pydantic schemas
│ │ ├── crud.py # Database functions
│ │ └── database.py # DB connection
│ └── requirements.txt
│
└── /frontend
├── /src
│ ├── /components # React components
│ ├── /pages # Page views
│ ├── App.jsx
│ └── main.jsx
├── package.json
└── vite.config.js

1. Backend Setup (Terminal 1)

Clone the repository (if you haven't):

git clone [https://github.com/your-username/habit-hero.git](https://github.com/your-username/habit-hero.git)
cd habit-hero/backend

Create a virtual environment:

# Windows

python -m venv venv
.\venv\Scripts\activate

# macOS / Linux

python3 -m venv venv
source venv/bin/activate

Install dependencies:

pip install -r requirements.txt

Run the FastAPI server:
The database (habits.db) will be created automatically in the /backend directory.

uvicorn app.main:app --reload

Your backend is now running at http://127.0.0.1:8000.

2. Frontend Setup (Terminal 2)

Navigate to the frontend directory:

# From the root directory

cd frontend

Install dependencies:

npm install

Run the Vite development server:

npm run dev

Your frontend is now running at http://localhost:5173 (or the port Vite assigns).

📡 API Endpoints

The backend provides the following RESTful API endpoints:

Method

Endpoint

Description

GET

/api/habits/

Retrieve a list of all habits.

POST

/api/habits/

Create a new habit.

GET

/api/habits/{habit_id}

Get details for a specific habit.

POST

/api/habits/{habit_id}/checkin

Log a check-in for a habit.

DELETE

/api/habits/{habit_id}

Delete a habit.

GET

/api/habits/{habit_id}/checkins

Get all check-in dates for a habit.

🚀 Future Roadmap

[ ] User Authentication (JWT)

[ ] Multiple Users

[ ] "Negative" Habits (e.g., "Don't smoke")

[ ] Weekly / Monthly frequency options

[ ] Data visualization with charts

📄 License

This project is licensed under the MIT License. See the LICENSE file for details.
