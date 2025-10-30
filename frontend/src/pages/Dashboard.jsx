import React, { useState, useEffect } from "react";
import apiClient from "../api";
import HabitForm from "../components/HabitForm";
import { format } from "date-fns";
import { Link } from 'react-router-dom';

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const todayString = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await apiClient.get("/habits/");
        setHabits(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching habits:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHabits();
  }, []);

  const handleHabitCreated = (newHabit) => {
    setHabits([newHabit, ...habits]);
  };

  const handleCheckIn = async (habitId) => {
    try {
      const response = await apiClient.post(`/habits/${habitId}/checkin`, {
        date: todayString,
      });
      const newCheckIn = response.data;

      setHabits((currentHabits) =>
        currentHabits.map((habit) => {
          if (habit.id === habitId) {
            return {
              ...habit,
              check_ins: [...habit.check_ins, newCheckIn],
            };
          }
          return habit;
        })
      );
    } catch (err) {
      console.error("Error checking in:", err);
    }
  };

  if (loading) {
    return <p>Loading habits...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const listStyle = { listStyle: "none", padding: 0 };
  const itemStyle = {
    padding: "1rem",
    border: "1px solid #eee",
    margin: "0.5rem 0",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  const buttonStyle = {
    padding: "0.5rem 1rem",
    cursor: "pointer",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "0.9rem",
  };
  
  const completedButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6c757d",
    cursor: "not-allowed",
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#0056b3',
    fontWeight: 'bold',
  };

  return (
    <div className="dashboard">
      <h1 style={{ textAlign: 'center' }}>Habit Hero Dashboard</h1>
      <HabitForm onHabitCreated={handleHabitCreated} />
      <hr />
      <h2>My Habits</h2>
      {habits.length === 0 ? (
        <p>You haven't created any habits yet.</p>
      ) : (
        <ul style={listStyle}>
          {habits.map((habit) => {
            const isCheckedInToday = habit.check_ins.some(
              (checkIn) => checkIn.date === todayString
            );

            return (
              <li key={habit.id} style={itemStyle}>
                <div>
                  <strong>
                    <Link to={`/habit/${habit.id}`} style={linkStyle}>
                      {habit.name}
                    </Link>
                  </strong>
                  <br />
                  <small>({habit.category})</small>
                </div>

                <button
                  style={
                    isCheckedInToday ? completedButtonStyle : buttonStyle
                  }
                  onClick={() => handleCheckIn(habit.id)}
                  disabled={isCheckedInToday}
                >
                  {isCheckedInToday ? "Completed!" : "Check-in"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;