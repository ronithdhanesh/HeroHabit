import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import HabitDetail from './pages/HabitDetail'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/habit/:habitId" element={<HabitDetail />} />
      </Routes>
    </div>
  )
}

export default App