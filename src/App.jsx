import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { CreateApartmentPage } from '@/pages/CreateApartmentPage'
import { ApartmentDetailPage } from '@/pages/ApartmentDetailPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apartman-olustur" element={<CreateApartmentPage />} />
        <Route path="/apartman/:apartmanId" element={<ApartmentDetailPage />} />
      </Routes>
    </Router>
  )
}

export default App
