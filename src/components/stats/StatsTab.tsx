import { useState } from 'react'
import { SearchBar } from './SearchBar'
import { PlayerStats } from './PlayerStats'
import { PlayerWithTeam } from '@/types'


export const StatsTab = () => {

  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithTeam | null>(null)

  const onPlayerSelect = (player: PlayerWithTeam) => {
    setSelectedPlayer(player)
  }

  return (
    <>
      <SearchBar onPlayerSelect={onPlayerSelect} />
      {selectedPlayer ?
        <PlayerStats player={selectedPlayer} /> : (
          <div>
            <h1>
              Select a player to view stats
            </h1>
          </div>
        )}
    </>
  )
}