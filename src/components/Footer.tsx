import { Link } from 'react-router-dom'
import { Camera } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <Camera size={18} className="text-primary" aria-hidden="true" />
          StudioBook
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link to="/browse" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">Browse</Link>
          <Link to="/list-studio" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">List a studio</Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">Terms</Link>
        </nav>
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} StudioBook. All rights reserved.</p>
      </div>
    </footer>
  )
}
