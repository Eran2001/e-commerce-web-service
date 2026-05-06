import { useState } from 'react'
import { Mail, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    toast.success('Thank you for subscribing!')
    setEmail('')
    setIsSubmitting(false)
  }

  return (
    <section className="py-16 lg:py-24 bg-card/30">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex p-4 rounded-full bg-gold/10 mb-6">
            <Mail className="h-8 w-8 text-gold" />
          </div>

          {/* Content */}
          <h2 className="font-display text-foreground mb-4">
            Stay in the Know
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter for exclusive offers, early access to new arrivals, and curated style guides.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-12 pl-12 pr-4 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 px-6 bg-gold text-charcoal font-medium rounded-md hover:bg-gold-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                'Subscribing...'
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Trust badges */}
          <p className="text-sm text-muted-foreground mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
