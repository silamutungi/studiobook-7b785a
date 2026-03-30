import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-3">Page not found</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">The page you are looking for does not exist. Let us get you back on track.</p>
      <Button onClick={() => navigate('/')}>Go home</Button>
    </div>
  )
}
