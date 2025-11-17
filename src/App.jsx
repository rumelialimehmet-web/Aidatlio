import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { CreateApartmentPage } from '@/pages/CreateApartmentPage'
import { ApartmentDetailPage } from '@/pages/ApartmentDetailPage'
import { UnitViewPage } from '@/pages/UnitViewPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apartman-olustur" element={<CreateApartmentPage />} />
        <Route path="/apartman/:apartmanId" element={<ApartmentDetailPage />} />
        <Route path="/apartman/:apartmanId/daire/:daireId" element={<UnitViewPage />} />
      </Routes>
    </Router>
  )
}

export default App
