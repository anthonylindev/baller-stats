
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useQuery } from "@tanstack/react-query"
import { getPlayersByQuery } from '@/api/players'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { PlayerWithTeam } from '@/types'

interface SearchBarProps {
  onPlayerSelect: (player: PlayerWithTeam) => void
  onPlayerCompare: (player: PlayerWithTeam) => void
  enableCompare: boolean
}

export function SearchBar({ onPlayerSelect, onPlayerCompare, enableCompare }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [currCursor, setCurrCursor] = useState(null)
  const debouncedQuery = useDebouncedValue(query, 500)

  console.log("debouncedQuery", debouncedQuery)

  const { data, isLoading } = useQuery({
    queryKey: ['players', debouncedQuery.trim()],
    queryFn: () => getPlayersByQuery(debouncedQuery.trim()),
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
      </form>
      {players && (
        <ul className="space-y-2">
          {players.map((player) => (
            <li
              key={player.id}
              className="p-4 bg-accent rounded cursor-pointer hover:bg-accent-foreground/10 flex justify-between items-center"
              onClick={() => onPlayerSelect(player)}
            >
              <div>
                <span className="text-primary mr-2">{player.first_name} {player.last_name}</span>
                <span className="text-muted-foreground">{player.team.full_name}</span>
              </div>
              <Button disabled={!enableCompare} onClick={() => onPlayerCompare(player)}>Compare</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

