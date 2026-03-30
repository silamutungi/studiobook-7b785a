import { useNavigate } from 'react-router-dom'
import { Camera, Shield, Clock, Star } from 'lucide-react'
import { Button } from '../components/ui/button'

const HERO_IMAGE_URL = 'https://gudiuktjzynkjvtqmuvi.supabase.co/storage/v1/object/public/hero-images/be8e3004-f981-479d-b627-f4297e73b194-hero.png'

const features = [
  { icon: '📸', title: 'Every studio type', description: 'Natural light, cyclorama, product, portrait, and video studios. Find exactly what your shoot needs.' },
  { icon: '✅', title: 'Verified hosts', description: 'Every studio is reviewed and verified before listing. You know what you are getting before you arrive.' },
  { icon: '⏱️', title: 'Book by the hour', description: 'No day-rate minimums. Book two hours or twelve. Pay only for the time your shoot actually needs.' },
  { icon: '🔑', title: 'Instant access', description: 'Confirm your booking and receive access instructions immediately. No back-and-forth required.' }
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div>
      <section
        className="relative min-h-[100svh] flex items-end md:items-center overflow-hidden"
        style={{ backgroundImage: `url(${HERO_IMAGE_URL})`, backgroundSize: 'cover', backgroundPosition: 'center top' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 pb-16 pt-32 md:py-32">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white mb-4 md:mb-6">
            The studio your<br className="hidden sm:block" /> shoot deserves.
          </h1>
          <p className="text-base md:text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
            Browse verified photography studios in your city. Book by the hour. Show up and shoot.
          </p>
          <Button
            onClick={() => navigate('/browse')}
            className="w-full sm:w-auto h-12 px-8 text-base font-medium"
          >
            Find a studio
          </Button>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built for photographers who move fast</h2>
          <p className="text-muted-foreground text-lg mb-16 max-w-xl leading-relaxed">
            From solo portrait sessions to full crew commercial shoots, find the right space in minutes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col gap-4">
                <span className="text-4xl">{f.icon}</span>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-muted/40">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                <Camera className="text-primary" size={20} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Browse studios</h3>
              <p className="text-muted-foreground leading-relaxed">Filter by type, location, capacity, and price. See real photos and amenities before you book.</p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                <Clock className="text-primary" size={20} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Pick your hours</h3>
              <p className="text-muted-foreground leading-relaxed">Choose your date and exactly how many hours you need. No minimums beyond the studio's policy.</p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
                <Shield className="text-primary" size={20} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Shoot with confidence</h3>
              <p className="text-muted-foreground leading-relaxed">Every booking is protected. Access instructions arrive instantly. The studio is ready when you are.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {[1,2,3,4,5].map((s) => <Star key={s} size={18} className="fill-primary text-primary" />)}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Own a studio? List it today.</h2>
              <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
                Turn your empty studio hours into reliable income. Set your own pricing and availability. We handle bookings.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button onClick={() => navigate('/list-studio')} variant="outline" className="h-12 px-8 text-base font-medium min-w-[160px]">
                List your studio
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
