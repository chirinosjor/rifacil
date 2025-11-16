'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateGameModal } from '@/components/dashboard/create-game-modal'
import { GamesTable } from '@/components/dashboard/games-table'

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setGames(data)
      }
      setLoading(false)
    }

    fetchGames()
  }, [supabase])

  const handleGameCreated = (newGame: any) => {
    setGames([newGame, ...games])
    setShowCreateModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Games</h1>
          <p className="text-muted-foreground mt-1">Manage your raffles and roulettes</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Create New Game
        </Button>
      </div>

      {showCreateModal && (
        <CreateGameModal
          onClose={() => setShowCreateModal(false)}
          onGameCreated={handleGameCreated}
        />
      )}

      {loading ? (
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">Loading games...</div>
          </CardContent>
        </Card>
      ) : games.length === 0 ? (
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center space-y-4 py-8">
              <p className="text-muted-foreground">No games yet</p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Create Your First Game
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <GamesTable games={games} />
      )}
    </div>
  )
}
