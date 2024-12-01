
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useQuery } from "@tanstack/react-query"
import { getPlayersByQuery } from '@/api/players'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { PlayerWithTeam } from '@/types'

interface SearchBarProps {
  onPlayerSelect: (player: PlayerWithTeam) => void
}

export function SearchBar({ onPlayerSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [currCursor, setCurrCursor] = useState(null)
  const debouncedQuery = useDebouncedValue(query, 500)

  console.log("debouncedQuery", debouncedQuery)

  const { data, isLoading } = useQuery({
    queryKey: ['players', debouncedQuery],
    queryFn: () => getPlayersByQuery(debouncedQuery),
    enabled: !!debouncedQuery,
    // placeholderData: keepPreviousData,
  })

  const players = data?.data

  console.log('search', debouncedQuery, data, isLoading)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // The query will automatically run when the query is longer than 2 characters
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search for a player..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit">Search</Button>
      </form>
      {players && (
        <ul className="space-y-2">
          {players.map((player) => (
            <li
              key={player.id}
              className="p-2 bg-accent rounded cursor-pointer hover:bg-accent-foreground/10"
              onClick={() => onPlayerSelect(player)}
            >
              <span className="text-primary">{player.first_name} {player.last_name}</span> - <span className="text-muted-foreground">{player.team.full_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

