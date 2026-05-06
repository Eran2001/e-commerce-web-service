import { Link } from 'react-router-dom'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 Number */}
        <div className="relative mb-8">
          <span className="font-display text-[150px] lg:text-[200px] font-bold text-gold/10 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-4xl lg:text-5xl text-gold">Oops!</span>
          </div>
        </div>

        {/* Message */}
        <h1 className="font-display text-3xl lg:text-4xl text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you&apos;re looking for seems to have wandered off into the digital wilderness. 
          Don&apos;t worry, even the best explorers lose their way sometimes.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-charcoal font-medium rounded-md hover:bg-gold-light transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gold text-gold font-medium rounded-md hover:bg-gold hover:text-charcoal transition-colors"
          >
            <Search className="h-4 w-4" />
            Browse Products
          </Link>
        </div>

        {/* Go Back */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 mt-8 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back to previous page
        </button>
      </div>
    </main>
  )
}
