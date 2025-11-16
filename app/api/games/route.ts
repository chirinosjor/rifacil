import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, total_numbers, ticket_price } = await request.json()

    // Validate input
    if (!name || !total_numbers || !ticket_price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create game
    const { data: game, error: gameError } = await supabase
      .from('games')
      .insert({
        user_id: user.id,
        name,
        total_numbers: parseInt(total_numbers),
        ticket_price: parseFloat(ticket_price),
      })
      .select()
      .single()

    if (gameError) {
      return NextResponse.json({ error: gameError.message }, { status: 400 })
    }

    // Create tickets (pre-populate all ticket numbers)
    const ticketsToCreate = Array.from({ length: total_numbers }, (_, i) => ({
      game_id: game.id,
      ticket_number: i + 1,
      is_paid: false,
    }))

    const { error: ticketsError } = await supabase
      .from('tickets')
      .insert(ticketsToCreate)

    if (ticketsError) {
      return NextResponse.json({ error: ticketsError.message }, { status: 400 })
    }

    return NextResponse.json(game)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
