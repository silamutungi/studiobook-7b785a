import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Studio } from '../types'
import { STUDIO_TYPE_LABELS } from '../types'
import { formatCurrency } from '../lib/utils'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { MapPin, Users, Clock, CheckCircle, ArrowLeft } from 'lucide-react'

export default function StudioDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [studio, setStudio] = useState<Studio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [startHour, setStartHour] = useState('9')
  const [hours, setHours] = useState('2')
  const [notes, setNotes] = useState('')
  const [bookingError, setBookingError] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    async function load() {
      if (!id) return
      const { data, error: fetchError } = await supabase.from('studios').select('*').eq('id', id).is('deleted_at', null).single()
      if (fetchError || !data) {
        setError('This studio could not be found.')
      } else {
        setStudio(data as Studio)
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleBook() {
    setBookingError('')
    if (!bookingDate) { setBookingError('Please select a date.'); return }
    const h = Number(hours)
    if (h < (studio?.min_hours ?? 1)) { setBookingError(`Minimum booking is ${studio?.min_hours} hour(s).`); return }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { navigate('/login'); return }
    setBookingLoading(true)
    const start = new Date(`${bookingDate}T${String(startHour).padStart(2,'0')}:00:00`)
    const end = new Date(start.getTime() + h * 3600000)
    const total = h * (studio?.hourly_rate ?? 0)
    const { error: insertError } = await supabase.from('bookings').insert({
      user_id: user.id,
      studio_id: id,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      hours: h,
      total_amount: total,
      status: 'pending',
      notes
    })
    setBookingLoading(false)
    if (insertError) {
      setBookingError('Booking failed. Please try again.')
    } else {
      setBookingSuccess(true)
    }
  }

  if (loading) return <div className="max-w-5xl mx-auto px-6 py-20"><div className="h-64 bg-muted animate-pulse rounded-lg" /></div>

  if (error || !studio) return (
    <div className="max-w-5xl mx-auto px-6 py-20 text-center">
      <p className="text-muted-foreground mb-6">{error || 'Studio not found.'}</p>
      <Button onClick={() => navigate('/browse')}>Back to browse</Button>
    </div>
  )

  const totalCost = Number(hours) * studio.hourly_rate

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <button onClick={() => navigate('/browse')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-1">
        <ArrowLeft size={16} /> Back to browse
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-foreground">{studio.name}</h1>
            {studio.is_verified && <Badge variant="default">Verified</Badge>}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1"><MapPin size={14} />{studio.city}, {studio.state}</span>
            <span className="flex items-center gap-1"><Users size={14} />Up to {studio.max_capacity} people</span>
            <span className="flex items-center gap-1"><Clock size={14} />Min {studio.min_hours} hr</span>
          </div>
          <Badge variant="secondary" className="mb-6">{STUDIO_TYPE_LABELS[studio.studio_type]}</Badge>
          <p className="text-foreground leading-relaxed mb-8">{studio.description}</p>
          {studio.amenities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">What is included</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {studio.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={14} className="text-primary shrink-0" />{a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{formatCurrency(studio.hourly_rate)}<span className="text-muted-foreground font-normal text-sm">/hr</span></CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {bookingSuccess ? (
                <div className="flex flex-col items-center text-center py-4 gap-3">
                  <CheckCircle size={32} className="text-primary" />
                  <p className="font-semibold text-foreground">Booking request sent</p>
                  <p className="text-sm text-muted-foreground">The host will confirm your booking shortly. Check your dashboard for updates.</p>
                  <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">View dashboard</Button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="booking-date">Date</Label>
                    <Input id="booking-date" type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="start-hour">Start time</Label>
                    <select
                      id="start-hour"
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {Array.from({length: 14}, (_, i) => i + 7).map((h) => (
                        <option key={h} value={h}>{h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h-12}:00 PM`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="hours">Duration (hours)</Label>
                    <Input id="hours" type="number" min={studio.min_hours} max="12" value={hours} onChange={(e) => setHours(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="notes">Notes for host (optional)</Label>
                    <Input id="notes" type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Equipment, crew size, shoot type..." maxLength={500} />
                  </div>
                  {Number(hours) > 0 && (
                    <div className="flex justify-between text-sm pt-2 border-t border-border">
                      <span className="text-muted-foreground">{hours} hr x {formatCurrency(studio.hourly_rate)}</span>
                      <span className="font-semibold text-foreground">{formatCurrency(totalCost)}</span>
                    </div>
                  )}
                  {bookingError && (
                    <div aria-live="polite" className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                      {bookingError}
                    </div>
                  )}
                  <Button onClick={handleBook} disabled={bookingLoading} className="w-full h-11">
                    {bookingLoading ? 'Requesting...' : 'Request to book'}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">No charge until the host confirms.</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
