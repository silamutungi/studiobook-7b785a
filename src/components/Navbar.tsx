import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from './ui/button'
import { Camera, Menu, X } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-md">
          <Camera size={20} className="text-primary" aria-hidden="true" />
          StudioBook
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-1">Browse</Link>
          <Link to="/list-studio" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-1">List a studio</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-1">Dashboard</Link>
              <Button variant="ghost" onClick={handleLogout} className="h-9 px-3 text-sm">Sign out</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" className="h-9 px-3 text-sm">Sign in</Button></Link>
              <Link to="/signup"><Button className="h-9 px-4 text-sm">Get started</Button></Link>
            </>
          )}
        </div>

        <button
          className="md:hidden flex items-center justify-center h-10 w-10 rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-4">
          <Link to="/browse" className="text-sm text-foreground py-2 min-h-[44px] flex items-center" onClick={() => setMenuOpen(false)}>Browse studios</Link>
          <Link to="/list-studio" className="text-sm text-foreground py-2 min-h-[44px] flex items-center" onClick={() => setMenuOpen(false)}>List a studio</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-foreground py-2 min-h-[44px] flex items-center" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="text-sm text-left text-foreground py-2 min-h-[44px] flex items-center">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-foreground py-2 min-h-[44px] flex items-center" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}><Button className="w-full h-11">Get started</Button></Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
