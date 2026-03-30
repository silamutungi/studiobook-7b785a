import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Browse from './pages/Browse'
import StudioDetail from './pages/StudioDetail'
import ListStudio from './pages/ListStudio'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/studios/:id" element={<StudioDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/list-studio" element={<ProtectedRoute><ListStudio /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
