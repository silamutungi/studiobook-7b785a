import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Studio, StudioType } from '../types'
import { STUDIO_TYPE_LABELS } from '../types'
import { formatCurrency } from '../lib/utils'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Search, MapPin, Users } from 'lucide-react'

export default function Browse() {
  const navigate = useNavigate()
  const [studios, setStudios] = useState<Studio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<StudioType | ''>('')
  const [maxRate, setMaxRate] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      let query = supabase.from('studios').select('*').eq('is_active', true).is('deleted_at', null)
      if (typeFilter) query = query.eq('studio_type', typeFilter)
      if (maxRate) query = query.lte('hourly_rate', Number(maxRate))
      const { data, error: fetchError } = await query.order('created_at', { ascending: false }).limit(40)
      if (fetchError) {
        setError('Could not load studios. Please try again.')
      } else {
        setStudios(data as Studio[])
      }
      setLoading(false)
    }
    load()
  }, [typeFilter, maxRate])

  const filtered = studios.filter((s) =>
    search === '' ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-2">Browse Studios</h1>
      <p className="text-muted-foreground mb-8">Find the right space for your next shoot.</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="type-filter" className="text-xs">Type</Label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as StudioType | '')}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All types</option>
              {Object.entries(STUDIO_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="max-rate" className="text-xs">Max $/hr</Label>
            <Input
              id="max-rate"
              type="number"
              placeholder="Any"
              value={maxRate}
              onChange={(e) => setMaxRate(e.target.value)}
              className="w-24"
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div aria-live="polite" className="text-destructive text-center py-16">
          <p className="mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Try again</Button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search size={40} className="text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No studios found</h2>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or search term.</p>
          <Button variant="outline" onClick={() => { setSearch(''); setTypeFilter(''); setMaxRate('') }}>Clear filters</Button>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => (
            <Card key={s.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate(`/studios/${s.id}`)}
              role="button" aria-label={`View ${s.name}`} tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/studios/${s.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{s.name}</CardTitle>
                  {s.is_verified && <Badge variant="default" className="text-xs shrink-0">Verified</Badge>}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin size={13} />
                  <span>{s.city}, {s.state}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users size={13} />
                  <span>Up to {s.max_capacity} people</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <Badge variant="secondary">{STUDIO_TYPE_LABELS[s.studio_type]}</Badge>
                  <span className="font-semibold text-foreground">{formatCurrency(s.hourly_rate)}<span className="text-muted-foreground font-normal text-xs">/hr</span></span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
