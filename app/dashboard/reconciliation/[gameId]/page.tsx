'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricsCard } from '@/components/reconciliation/metrics-card'
import { TicketsTable } from '@/components/reconciliation/tickets-table'

export default function ReconciliationPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string
  const [game, setGame] = useState<any>(null)
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Fetch game
      const { data: gameData } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single()

      if (gameData) {
        setGame(gameData)
      }

      // Fetch tickets
      const { data: ticketsData } = await supabase
        .from('tickets')
        .select('*')
        .eq('game_id', gameId)
        .order('ticket_number', { ascending: true })

      if (ticketsData) {
        setTickets(ticketsData)
      }

      setLoading(false)
    }

    fetchData()
  }, [gameId, supabase])

  const handleConfirmPayment = async (ticketId: string) => {
    setConfirming(ticketId)

    const { error } = await supabase
      .from('tickets')
      .update({ is_paid: true, paid_at: new Date().toISOString() })
      .eq('id', ticketId)

    if (!error) {
      setTickets(
        tickets.map((t) =>
          t.id === ticketId ? { ...t, is_paid: true, paid_at: new Date().toISOString() } : t
        )
      )
    }

    setConfirming(null)
  }

  if (loading || !game) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const paidTickets = tickets.filter((t) => t.is_paid)
  const unpaidTickets = tickets.filter((t) => !t.is_paid)
  const totalConfirmedRevenue = paidTickets.length * Number(game.ticket_price)
  const totalUnreconciled = unpaidTickets.length * Number(game.ticket_price)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="hover:bg-muted"
        >
          ← Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{game.name}</h1>
          <p className="text-muted-foreground mt-1">Payment reconciliation dashboard</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricsCard
          title="Total Confirmed Revenue"
          value={`$${totalConfirmedRevenue.toFixed(2)}`}
          description={`${paidTickets.length} paid tickets`}
          variant="confirmed"
        />
        <MetricsCard
          title="Total Unreconciled Revenue"
          value={`$${totalUnreconciled.toFixed(2)}`}
          description={`${unpaidTickets.length} unpaid tickets`}
          variant="unreconciled"
        />
      </div>

      {/* Unpaid Tickets Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Unpaid Tickets</CardTitle>
          <CardDescription>
            Mark tickets as paid to update your reconciliation status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {unpaidTickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              All tickets have been paid! 🎉
            </div>
          ) : (
            <TicketsTable
              tickets={unpaidTickets}
              ticketPrice={game.ticket_price}
              onConfirmPayment={handleConfirmPayment}
              confirming={confirming}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
