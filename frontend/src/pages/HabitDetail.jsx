import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

function HabitDetail() {

  const { habitId } = useParams();
  const navigate = useNavigate();

  const [habit, setHabit] = useState(null);
  const [streak, setStreak] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    frequency: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [habitRes, streakRes] = await Promise.all([
          apiClient.get(`/habits/${habitId}`),
          apiClient.get(`/analytics/${habitId}/streak`),
        ]);

        setHabit(habitRes.data);
        setStreak(streakRes.data.current_streak);

        setFormData({
          name: habitRes.data.name,
          category: habitRes.data.category,
          frequency: habitRes.data.frequency,
        });
      } catch (err) {
        console.error('Error fetching habit details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [habitId]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const updatedHabitData = {
        ...formData,
        start_date: habit.start_date,
      };

      const response = await apiClient.put(`/habits/${habitId}`, updatedHabitData);
      setHabit(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating habit:', err);
      setError('Failed to update habit.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: habit.name,
      category: habit.category,
      frequency: habit.frequency,
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this habit? This is permanent.')) {
      try {
        await apiClient.delete(`/habits/${habitId}`);
        navigate('/');
      } catch (err) {
        console.error('Error deleting habit:', err);
        setError('Failed to delete habit.');
      }
    }
  };

  const completedDates = new Set(habit?.check_ins.map((checkIn) => checkIn.date) || []);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = format(date, 'yyyy-MM-dd');
      if (completedDates.has(dateString)) {
        return 'habit-completed-day';
      }
    }
    return null;
  };

  if (loading) return <p>Loading details...</p>;
  if (error && !habit) return <p>Error: {error}</p>;

  const containerStyle = {
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginTop: '1rem',
  };
  const analyticsContainer = {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'space-around',
    textAlign: 'center',
  };
  const streakStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#007bff',
    margin: '0.5rem 0',
  };
  const calendarContainer = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
  };
  const buttonContainer = {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  };
  const buttonStyle = {
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  };
  const deleteButtonStyle = { ...buttonStyle, backgroundColor: '#dc3545' };
  const cancelButtonStyle = { ...buttonStyle, backgroundColor: '#6c757d' };
  const inputStyle = {
    padding: '0.5rem',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '90%',
  };
  const selectStyle = {
    padding: '0.5rem',
    fontSize: '1rem',
    marginLeft: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  return (
    <div>
      <Link to="/">&larr; Back to Dashboard</Link>

      <form onSubmit={handleSave}>
        <div style={containerStyle}>
          {/* --- Editable Details --- */}
          <h1 style={{ marginTop: 0, fontSize: '1.5rem' }}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              disabled={!isEditing}
              style={{
                ...inputStyle,
                fontSize: '1.75rem',
                border: isEditing ? '1px solid #007bff' : 'none',
                paddingLeft: 0,
              }}
            />
          </h1>

          <p>
            <strong>Category:</strong>
            <select
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              disabled={!isEditing}
              style={{
                ...selectStyle,
                border: isEditing ? '1px solid #ccc' : 'none',
                appearance: isEditing ? 'auto' : 'none',
              }}
            >
              <option value="learning">Learning</option>
              <option value="health">Health</option>
              <option value="work">Work</option>
              <option value="fitness">Fitness</option>
              <option value="mental health">Mental Health</option>
              <option value="productivity">Productivity</option>
            </select>
          </p>

          <p>
            <strong>Frequency:</strong>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleFormChange}
              disabled={!isEditing}
              style={{
                ...selectStyle,
                border: isEditing ? '1px solid #ccc' : 'none',
                appearance: isEditing ? 'auto' : 'none',
              }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </p>

          <p>
            <strong>Start Date:</strong> {habit.start_date}
          </p>

          <hr />

          <h3>Analytics</h3>
          <div style={analyticsContainer}>
            <div>
              <p>Current Streak</p>
              <p style={streakStyle}>
                {streak} {streak === 1 ? 'day' : 'days'}
              </p>
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

          {/* --- Action Buttons --- */}
          <hr />
          <div style={buttonContainer}>
            {isEditing ? (
              <>
                <button type="submit" style={buttonStyle}>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={cancelButtonStyle}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  style={buttonStyle}
                >
                  Edit Habit
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  style={deleteButtonStyle}
                >
                  Delete Habit
                </button>
              </>
            )}
          </div>

          {error && (
            <p style={{ color: 'red', marginTop: '1rem' }}>Error: {error}</p>
          )}
        </div>
      </form>
    </div>
  );
}

export default HabitDetail;
