import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30',
  secondary: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  outline: 'bg-transparent text-zinc-400 border-zinc-600',
  success: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-600/20 text-amber-400 border-amber-500/30',
}

export function Badge({ children, variant = 'default', className }: BadgeProps): React.ReactElement {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

