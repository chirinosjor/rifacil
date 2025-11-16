import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    // Create Supabase client (reads cookies from request)
    const supabase = await createServerSupabaseClient();

    // Check authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { name, total_numbers, ticket_price } = await req.json();

    if (!name || !total_numbers || !ticket_price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create game
    const { data: game, error: gameError } = await supabase
      .from("games")
      .insert({
        user_id: user.id,
        name,
        total_numbers: Number(total_numbers),
        ticket_price: Number(ticket_price),
      })
      .select()
      .single();

    if (gameError) {
      return NextResponse.json({ error: gameError.message }, { status: 400 });
    }

    // Pre-create all tickets
    const tickets = Array.from({ length: Number(total_numbers) }, (_, i) => ({
      game_id: game.id,
      ticket_number: i + 1,
      is_paid: false,
    }));

    const { error: ticketsError } = await supabase
      .from("tickets")
      .insert(tickets);

    if (ticketsError) {
      return NextResponse.json(
        { error: ticketsError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(game);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
