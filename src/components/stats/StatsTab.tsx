import { useState } from 'react'
import { SearchBar } from './SearchBar'
import { PlayerStats } from './PlayerStats'
import { PlayerWithTeam } from '@/types'


export const StatsTab = () => {

  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithTeam | null>(null)

  const [selectedPlayers, setSelectedPlayers] = useState<PlayerWithTeam[]>([])

  const onPlayerSelect = (player: PlayerWithTeam) => {

    setSelectedPlayer(player)
    if (!selectedPlayers.length) {
      setSelectedPlayers([player])
    }
  }

  const onPlayerCompare = (player: PlayerWithTeam) => {
    setSelectedPlayers(prev => [...prev, player])
  }

  return (
    <>
      <SearchBar onPlayerSelect={onPlayerSelect} onPlayerCompare={onPlayerCompare} enableCompare={!!selectedPlayers.length} />
      {selectedPlayer ?
        <PlayerStats player={selectedPlayer} players={selectedPlayers} /> : (
          <div>
            <h1>
              Select a player to view stats
            </h1>
          </div>
        )}
    </>
  )
}