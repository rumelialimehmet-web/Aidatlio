import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { CreateApartmentPage } from '@/pages/CreateApartmentPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apartman-olustur" element={<CreateApartmentPage />} />
      </Routes>
    </Router>
  )
}

export default App
