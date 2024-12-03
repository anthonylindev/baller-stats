import { useState } from 'react'
import { SearchBar } from './SearchBar'
import { StatsAndInfo } from './StatsAndInfo'
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

  const onPlayerAdd = (player: PlayerWithTeam) => {
    setSelectedPlayer(player)
    setSelectedPlayers(prev => [...prev, player])
  }

  const onPlayerRemove = (player: PlayerWithTeam) => {
    setSelectedPlayers(prev => prev.filter(p => p.id !== player.id))
  }

  return (
    <div className='space-y-4'>
      <div className='h-[400px] flex flex-col'>
        <SearchBar onPlayerSelect={onPlayerSelect} onPlayerAdd={onPlayerAdd} onPlayerRemove={onPlayerRemove} selectedPlayers={selectedPlayers} />
      </div>
      {selectedPlayer ?
        <StatsAndInfo player={selectedPlayer} players={selectedPlayers} /> : (
          <div>
            <h1>
              Select a player to view stats
            </h1>
          </div>
        )}
    </div>
  )
}