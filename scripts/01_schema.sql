-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create games table (rifas and ruletas)
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  total_numbers INTEGER NOT NULL,
  ticket_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create tickets table
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  ticket_number INTEGER NOT NULL,
  is_paid BOOLEAN DEFAULT false,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(game_id, ticket_number)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for games
CREATE POLICY "Users can view their own games" ON public.games
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create games" ON public.games
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own games" ON public.games
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own games" ON public.games
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for tickets
CREATE POLICY "Users can view tickets for their games" ON public.tickets
  FOR SELECT USING (
    game_id IN (
      SELECT id FROM public.games WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tickets for their games" ON public.tickets
  FOR INSERT WITH CHECK (
    game_id IN (
      SELECT id FROM public.games WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tickets for their games" ON public.tickets
  FOR UPDATE USING (
    game_id IN (
      SELECT id FROM public.games WHERE user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_games_user_id ON public.games(user_id);
CREATE INDEX idx_tickets_game_id ON public.tickets(game_id);
CREATE INDEX idx_tickets_is_paid ON public.tickets(is_paid);
