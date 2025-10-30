import React, { useState } from "react";
import apiClient from "../api";
import { format } from "date-fns";

function HabitForm({ onHabitCreated }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("learning");
  const [frequency, setFrequency] = useState("daily");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const today = format(new Date(), "yyyy-MM-dd");

    const newHabit = {
      name: name,
      category: category,
      frequency: frequency,
      start_date: today,
    };

    try {
      const response = await apiClient.post("/habits/", newHabit);
      onHabitCreated(response.data);
      
      setName("");
      setCategory("learning");
      setFrequency("daily");
    } catch (err) {
      console.error("Error creating habit:", err);
      setError(err.message);
    }
  };

  const formStyle = {
    margin: "2rem 0",
    padding: "1.5rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  };

  const inputStyle = { padding: "0.5rem", fontSize: "1rem", borderRadius: "4px", border: "1px solid #ccc" };
  const buttonStyle = { padding: "0.75rem", fontSize: "1rem", cursor: "pointer", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3 style={{ marginTop: 0 }}>Create a New Habit</h3>
      <input
        type="text"
        placeholder="Habit name (e.g., Read 10 pages)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={inputStyle}
      />
      
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
        <option value="learning">Learning</option>
        <option value="health">Health</option>
        <option value="work">Work</option>
        <option value="fitness">Fitness</option>
        <option value="mental health">Mental Health</option>
        <option value="productivity">Productivity</option>
      </select>

      <select value={frequency} onChange={(e) => setFrequency(e.target.value)} style={inputStyle}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>
      
      <button type="submit" style={buttonStyle}>Add Habit</button>
      
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </form>
  );
}

export default HabitForm;