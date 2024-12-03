
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import { getPlayersByQuery, getPlayers } from '@/api/players'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { PlayerWithTeam } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SearchBarProps {
  onPlayerSelect: (player: PlayerWithTeam) => void
  onPlayerAdd: (player: PlayerWithTeam) => void
  onPlayerRemove: (player: PlayerWithTeam) => void
  selectedPlayers: PlayerWithTeam[]
}

export function SearchBar({ onPlayerSelect, onPlayerAdd, onPlayerRemove, selectedPlayers }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 500)

  console.log("debouncedQuery", debouncedQuery)

  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['players', debouncedQuery.trim()],
    queryFn: ({ pageParam }) => getPlayersByQuery(debouncedQuery.trim(), pageParam),
    enabled: !!debouncedQuery,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    initialPageParam: 0,
  })

  console.log('infiniteSearch results', data, data?.pages.flatMap(page => page.data))

  const players = data?.pages.flatMap(page => page.data)
  const validPlayers = players?.filter(player => !!player.draft_year) || []

  console.log('search', debouncedQuery, data, isLoading)

  return (
    <div className="flex flex-col h-full">
      <div className='mb-4'>
        <Input
          type="text"
          placeholder="Search for a player..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
      </div>
      <ScrollArea className="flex-grow" type='auto'>
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : validPlayers?.length ? (
          <div className='space-y-4'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Team</TableHead>
                  <TableHead className="hidden md:table-cell">Draft Year</TableHead>
                  <TableHead className="w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validPlayers.map((player) => (
                  <SearchTableRow
                    key={player.id}
                    player={player}
                    isAdded={selectedPlayers?.some(selectedPlayer => selectedPlayer.id === player.id)}
                    onPlayerAdd={onPlayerAdd}
                    onPlayerRemove={onPlayerRemove}
                  />
                ))}
              </TableBody>
            </Table>
            {(hasNextPage && !isFetchingNextPage) && <Button onClick={() => fetchNextPage()}>Load More</Button>}
          </div>
        ) : debouncedQuery?.length ? (
          <p className="text-center text-muted-foreground">No results found</p>
        ) : null}
      </ScrollArea>
    </div>
  )
}

const SearchTableRow: React.FC<{
  player: PlayerWithTeam, isAdded: boolean; onPlayerAdd: (player: PlayerWithTeam) => void
  onPlayerRemove: (player: PlayerWithTeam) => void
}> = ({ player, isAdded, onPlayerAdd, onPlayerRemove }) => {

  const handleAction = () => {
    if (isAdded) {
      onPlayerRemove(player)
    } else {
      onPlayerAdd(player)
    }
  }

  return (
    <TableRow className="text-start w-full">
      <TableCell>{player.first_name} {player.last_name}</TableCell>
      <TableCell className="hidden sm:table-cell">{player.team.full_name}</TableCell>
      <TableCell className="hidden md:table-cell">{player.draft_year}</TableCell>
      <TableCell className=''>
        <div className='flex justify-end mr-4'>
          <Button
            onClick={handleAction}
            className='w-24'
          >
            {`${isAdded ? 'Remove' : 'Add'}`}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}