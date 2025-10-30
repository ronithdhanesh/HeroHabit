import React, { useState, useEffect } from "react";
import apiClient from "../api"; 

function Dashboard() {
  const [habits, setHabits] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


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

  if (loading) {
    return <p>Loading habits...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="dashboard">
      <h1>Habit Hero Dashboard</h1>
      <hr />
      <h2>My Habits</h2>
      {habits.length === 0 ? (
        <p>You haven't created any habits yet.</p>
      ) : (
        <ul>
          {habits.map((habit) => (
            <li key={habit.id}>
              <strong>{habit.name}</strong> ({habit.category})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;