import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  )
}

// Geçici ana sayfa - sonra değiştireceğiz
function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Aidatlio
        </h1>
        <p className="text-gray-600">
          Apartman aidat takip sistemi - Kurulum başarılı! 🎉
        </p>
      </div>
    </div>
  )
}

export default App
