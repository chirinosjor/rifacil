"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CreateGameModalProps {
  onClose: () => void;
  onGameCreated: (game: any) => void;
}

export function CreateGameModal({
  onClose,
  onGameCreated,
}: CreateGameModalProps) {
  const [name, setName] = useState("");
  const [totalNumbers, setTotalNumbers] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !totalNumbers || !ticketPrice) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <-- THIS FIXES THE 401
        body: JSON.stringify({
          name,
          total_numbers: totalNumbers,
          ticket_price: ticketPrice,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create game");
      }

      const game = await response.json();
      onGameCreated(game);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md border-border">
        <CardHeader>
          <CardTitle>Create New Game</CardTitle>
          <CardDescription>Set up a new rifa or ruleta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Game Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Grand Prize Draw"
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Total Numbers
              </label>
              <input
                type="number"
                value={totalNumbers}
                onChange={(e) => setTotalNumbers(e.target.value)}
                placeholder="e.g., 100"
                min="1"
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Ticket Price
              </label>
              <input
                type="number"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                placeholder="e.g., 10.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={loading}
              />
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-border hover:bg-muted"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Creating..." : "Create Game"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
