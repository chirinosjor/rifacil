import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface MetricsCardProps {
  title: string
  value: string
  description: string
  variant: 'confirmed' | 'unreconciled'
}

export function MetricsCard({
  title,
  value,
  description,
  variant,
}: MetricsCardProps) {
  const variants = {
    confirmed: 'border-l-4 border-l-green-500',
    unreconciled: 'border-l-4 border-l-amber-500',
  }

  return (
    <Card className={`border-border ${variants[variant]}`}>
      <CardHeader>
        <CardDescription className="text-sm text-muted-foreground">
          {title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-foreground">{value}</div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
