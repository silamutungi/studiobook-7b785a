import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Booking, Studio } from '../types'
import { formatCurrency, formatDate, formatTime } from '../lib/utils'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Calendar, Building2, Plus } from 'lucide-react'

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  confirmed: 'default',
  pending: 'secondary',
  cancelled: 'destructive',
  completed: 'outline'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [myStudios, setMyStudios] = useState<Studio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'bookings' | 'studios'>('bookings')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [bookingsRes, studiosRes] = await Promise.all([
        supabase.from('bookings').select('*, studio:studios(*)').eq('user_id', user.id).is('deleted_at', null).order('start_time', { ascending: false }).limit(20),
        supabase.from('studios').select('*').eq('user_id', user.id).is('deleted_at', null).order('created_at', { ascending: false })
      ])
      if (bookingsRes.error || studiosRes.error) {
        setError('We could not load your data. Please refresh to try again.')
      } else {
        setBookings(bookingsRes.data as Booking[])
        setMyStudios(studiosRes.data as Studio[])
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <Button onClick={() => navigate('/browse')} className="h-11 px-6">
          <Plus size={16} className="mr-2" /> Book a studio
        </Button>
      </div>

      <div className="flex gap-2 mb-8 border-b border-border">
        <button
          onClick={() => setTab('bookings')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors min-h-[44px] ${tab === 'bookings' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          My Bookings
        </button>
        <button
          onClick={() => setTab('studios')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors min-h-[44px] ${tab === 'studios' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          My Studios
        </button>
      </div>

      {loading && (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div aria-live="polite" className="text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <p className="font-medium mb-3">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      )}

      {!loading && !error && tab === 'bookings' && (
        bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Calendar size={40} className="text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No bookings yet</h2>
            <p className="text-muted-foreground mb-6">Find a studio that fits your shoot and book your first session.</p>
            <Button onClick={() => navigate('/browse')}>Browse studios</Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((b) => (
              <Card key={b.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="font-semibold text-foreground">{b.studio?.name ?? 'Studio'}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(b.start_time)} &middot; {formatTime(b.start_time)} &ndash; {formatTime(b.end_time)}
                    </p>
                    <p className="text-sm text-muted-foreground">{b.hours} {b.hours === 1 ? 'hour' : 'hours'} &middot; {formatCurrency(b.total_amount)}</p>
                  </div>
                  <Badge variant={STATUS_VARIANT[b.status] ?? 'outline'}>{b.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}

      {!loading && !error && tab === 'studios' && (
        <div>
          <div className="flex justify-end mb-6">
            <Button variant="outline" onClick={() => navigate('/list-studio')} className="h-10 px-4">
              <Plus size={16} className="mr-2" /> List a studio
            </Button>
          </div>
          {myStudios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Building2 size={40} className="text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No studios listed</h2>
              <p className="text-muted-foreground mb-6">List your studio and start earning from your unused hours.</p>
              <Button onClick={() => navigate('/list-studio')}>List your studio</Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {myStudios.map((s) => (
                <Card key={s.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <p className="font-semibold text-foreground">{s.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{s.city}, {s.state} &middot; {formatCurrency(s.hourly_rate)}/hr</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={s.is_verified ? 'default' : 'secondary'}>{s.is_verified ? 'Verified' : 'Pending'}</Badge>
                      <Badge variant={s.is_active ? 'default' : 'outline'}>{s.is_active ? 'Active' : 'Inactive'}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
