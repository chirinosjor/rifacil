'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Game {
  id: string
  name: string
  total_numbers: number
  ticket_price: number
  created_at: string
}

interface GamesTableProps {
  games: Game[]
}

export function GamesTable({ games }: GamesTableProps) {
  return (
    <div className="overflow-x-auto">
      <Card className="border-border">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Total Numbers</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Ticket Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Created</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{game.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{game.total_numbers}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">${Number(game.ticket_price).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(game.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/dashboard/reconciliation/${game.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border hover:bg-muted"
                      >
                        Reconcile
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
