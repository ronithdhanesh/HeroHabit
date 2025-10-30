Habit Hero 🚀Habit Hero is a modern, full-stack habit tracker designed to help you build better routines and stay consistent. This application provides a clean dashboard to manage your habits, track your daily progress, and visualize your consistency over time with detailed analytics.(Suggestion: Replace the link above with a screenshot of your app's dashboard!)📋 FeaturesCreate & Manage Habits: Easily add new habits with a name, category (e.g., Learning, Health, Fitness), and frequency.Daily Progress Tracking: Mark habits as complete for the day with a simple "Check-in" button.Instant Feedback: The UI updates instantly when a habit is checked in, disabling the button to prevent double-logging.Dynamic Dashboard: View all your habits in a clean, centralized dashboard.Detailed Analytics: Click any habit to see a detailed view, including:Streak Calculation: Automatically calculates your current consecutive-day streak.Total Check-ins: See your total number of completions.Calendar View: Visualize your consistency with a full calendar highlighting all days you successfully completed your habit.✨ Tech StackFrontendBackendDatabaseReactJSFastAPISQLiteVitePythonSQLAlchemy (ORM)React RouterUvicornPydanticAxios🛠️ Setup and InstallationTo run this project locally, you will need two terminals.Project Structure/HabitHero
├── /backend
│ ├── /app
│ │ ├── main.py
│ │ ├── models.py
│ │ ├── schemas.py
│ └── habithero.db
├── /frontend
│ ├── /src
│ │ ├── /components
│ │ ├── /pages
│ │ ├── App.jsx
│ │ └── main.jsx
└── README.md

1. Backend Setup (Terminal 1)Navigate to the backend folder:Bashcd HabitHero/backend
   Create and activate a virtual environment:Bash# On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate

# On Windows

python -m venv venv
.\venv\Scripts\activate
Install dependencies:Bashpip install "fastapi[all]" sqlalchemy
Run the backend server:Bashuvicorn app.main:app --reload
✅ Your backend is now running!It will be accessible at http://localhost:8000.You can view the API docs at http://localhost:8000/docs.2. Frontend Setup (Terminal 2)Navigate to the frontend folder:Bashcd HabitHero/frontend
Install dependencies:Bashnpm install
Run the frontend development server:Bashnpm run dev
✅ Your frontend is now running!It will be accessible at http://localhost:5173 (or the port specified in your terminal).🚦 API EndpointsThe backend provides the following RESTful API endpoints:MethodRouteDescriptionPOST/habits/Create a new habit.GET/habits/Get a list of all habits.GET/habits/{habit_id}Get details for a single habit.PUT/habits/{habit_id}Update an existing habit.DELETE/habits/{habit_id}Delete a habit.POST/habits/{habit_id}/checkinLog a check-in for a habit on a specific date.GET/analytics/{habit_id}/streakCalculate the current streak for a habit.
