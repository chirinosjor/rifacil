'use client'

import { Button } from '@/components/ui/button'

interface Ticket {
  id: string
  ticket_number: number
  is_paid: boolean
}

interface TicketsTableProps {
  tickets: Ticket[]
  ticketPrice: number
  onConfirmPayment: (ticketId: string) => void
  confirming: string | null
}

export function TicketsTable({
  tickets,
  ticketPrice,
  onConfirmPayment,
  confirming,
}: TicketsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-semibold text-foreground">Ticket #</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Price</th>
            <th className="px-4 py-3 text-right font-semibold text-foreground">Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-foreground">#{ticket.ticket_number}</td>
              <td className="px-4 py-3 text-muted-foreground">${Number(ticketPrice).toFixed(2)}</td>
              <td className="px-4 py-3 text-right">
                <Button
                  onClick={() => onConfirmPayment(ticket.id)}
                  disabled={confirming === ticket.id}
                  className="bg-green-600 text-white hover:bg-green-700"
                  size="sm"
                >
                  {confirming === ticket.id ? 'Confirming...' : 'Confirm Payment'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
