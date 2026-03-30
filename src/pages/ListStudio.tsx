import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { STUDIO_TYPE_LABELS, AMENITY_OPTIONS, type StudioType } from '../types'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function ListStudio() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [studioType, setStudioType] = useState<StudioType>('natural_light')
  const [hourlyRate, setHourlyRate] = useState('')
  const [minHours, setMinHours] = useState('1')
  const [maxCapacity, setMaxCapacity] = useState('')
  const [amenities, setAmenities] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function toggleAmenity(a: string) {
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a])
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!name || !description || !city || !state || !hourlyRate || !maxCapacity) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { navigate('/login'); return }
    const { error: insertError } = await supabase.from('studios').insert({
      user_id: user.id,
      name,
      description,
      location,
      city,
      state,
      studio_type: studioType,
      hourly_rate: Number(hourlyRate),
      min_hours: Number(minHours),
      max_capacity: Number(maxCapacity),
      amenities,
      is_verified: false,
      is_active: true
    })
    setLoading(false)
    if (insertError) {
      setError('Could not list your studio. Please try again.')
    } else {
      setSuccess(true)
    }
  }

  if (success) return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div className="text-4xl mb-6">🎉</div>
      <h1 className="text-2xl font-bold text-foreground mb-3">Studio submitted</h1>
      <p className="text-muted-foreground mb-8">Your studio is under review. We verify every listing before it goes live, usually within 24 hours.</p>
      <Button onClick={() => navigate('/dashboard')}>Go to dashboard</Button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-2">List your studio</h1>
      <p className="text-muted-foreground mb-8">Tell photographers what makes your space special.</p>
      <Card>
        <CardHeader><CardTitle>Studio details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-name">Studio name *</Label>
              <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. The Light Factory" maxLength={100} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-desc">Description *</Label>
              <textarea
                id="s-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your studio, its vibe, and what makes it stand out..."
                maxLength={2000}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="s-city">City *</Label>
                <Input id="s-city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="New York" maxLength={100} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="s-state">State *</Label>
                <Input id="s-state" value={state} onChange={(e) => setState(e.target.value)} placeholder="NY" maxLength={50} required />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-location">Street address</Label>
              <Input id="s-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="123 Studio Ave (shown after booking)" maxLength={200} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-type">Studio type *</Label>
              <select
                id="s-type"
                value={studioType}
                onChange={(e) => setStudioType(e.target.value as StudioType)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {Object.entries(STUDIO_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="s-rate">Rate ($/hr) *</Label>
                <Input id="s-rate" type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="75" min="1" max="9999" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="s-min">Min hours</Label>
                <Input id="s-min" type="number" value={minHours} onChange={(e) => setMinHours(e.target.value)} min="1" max="12" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="s-cap">Max people *</Label>
                <Input id="s-cap" type="number" value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)} placeholder="10" min="1" max="500" required />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AMENITY_OPTIONS.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-sm cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={amenities.includes(a)}
                      onChange={() => toggleAmenity(a)}
                      className="rounded border-input text-primary focus:ring-ring h-4 w-4"
                    />
                    <span className="text-foreground">{a}</span>
                  </label>
                ))}
              </div>
            </div>
            {error && (
              <div aria-live="polite" className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                {error}
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full h-11">
              {loading ? 'Submitting...' : 'Submit for review'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
