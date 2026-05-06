import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'sale' | 'new' | 'soldout'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-card text-foreground',
    sale: 'bg-gold text-charcoal',
    new: 'bg-green-600 text-white',
    soldout: 'bg-muted text-muted-foreground',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
