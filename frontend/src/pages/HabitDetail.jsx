import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import apiClient from '../api'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css' 
import { format } from 'date-fns'

function HabitDetail() {
  const [habit, setHabit] = useState(null)
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { habitId } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [habitRes, streakRes] = await Promise.all([
          apiClient.get(`/habits/${habitId}`),
          apiClient.get(`/analytics/${habitId}/streak`)
        ])
        
        setHabit(habitRes.data)
        setStreak(streakRes.data.current_streak)

      } catch (err) {
        console.error("Error fetching habit details:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [habitId])

  const completedDates = new Set(
    habit?.check_ins.map(checkIn => checkIn.date) || []
  );

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = format(date, 'yyyy-MM-dd');
      if (completedDates.has(dateString)) {
        return 'habit-completed-day';
      }
    }
    return null;
  };

  if (loading) return <p>Loading details...</p>
  if (error) return <p>Error: {error}</p>
  if (!habit) return <p>Habit not found.</p>

  const containerStyle = { padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', marginTop: '1rem' };
  const analyticsContainer = { display: 'flex', gap: '2rem', justifyContent: 'space-around', textAlign: 'center' };
  const streakStyle = { fontSize: '2.5rem', fontWeight: 'bold', color: '#007bff', margin: '0.5rem 0' };
  const calendarContainer = { display: 'flex', justifyContent: 'center', marginTop: '1rem' };

  return (
    <div>
      <Link to="/">&larr; Back to Dashboard</Link>
      
      <div style={containerStyle}>
        <h1 style={{ marginTop: 0 }}>{habit.name}</h1>
        <p><strong>Category:</strong> {habit.category}</p>
        <p><strong>Frequency:</strong> {habit.frequency}</p>
        <p><strong>Start Date:</strong> {habit.start_date}</p>
        <hr />
        
        <h3>Analytics</h3>
        <div style={analyticsContainer}>
          <div>
            <p>Current Streak</p>
            <p style={streakStyle}>{streak} {streak === 1 ? 'day' : 'days'}</p>
          </div>
          <div>
            <p>Total Check-ins</p>
            <p style={streakStyle}>{habit.check_ins.length}</p>
          </div>
        </div>

        <hr />
        <h3>Progress Calendar</h3>
        <div style={calendarContainer}>
          <Calendar
            tileClassName={tileClassName}
            defaultValue={new Date(habit.start_date)}
          />
        </div>
      </div>
    </div>
  )
}

export default HabitDetail