import React, { useState } from "react";
import { usePlayerAverages, useCombinedAverages } from '@/hooks/usePlayerAverages'
import { PlayerStats, PlayerWithTeam } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer, Line } from 'recharts'

interface PlayerStatsProps {
  player: PlayerWithTeam
  players: PlayerWithTeam[]
}

const colors = ['#716cd8', '#d86cbd', '#d89c6c', '#92d86c', '#6cd8c8'];

const statCategories: { value: keyof PlayerStats; label: string }[] = [
  { value: 'pts', label: 'Points' },
  { value: 'ast', label: 'Assists' },
  { value: 'fg_pct', label: 'FG %' },
  { value: 'min', label: 'Minutes' },
  { value: 'reb', label: 'Rebounds' },
  { value: 'fg3_pct', label: '3PT %' },
  { value: 'fg3m', label: '3PT' },
] as const

export const StatsAndInfo: React.FC<PlayerStatsProps> = ({ player, players }) => {

  const { id, draft_year } = player

  const { data, isLoading } = usePlayerAverages(draft_year || 2024, id)

  const combinedQueryParams = players.map(player => ({ startSeason: player.draft_year || 2024, playerId: player.id }))

  const { data: combinedData } = useCombinedAverages(combinedQueryParams)

  const [selectedStatCategory, setSelectedStatCategory] = useState<keyof PlayerStats>('pts')

  // console.log('PlayerStats', data, isLoading)

  console.log('Combined DAta', combinedData, combinedQueryParams)

  // const [lineChartData, setLineChartData] = useState<{ name: string, value: number }[]>([])
  let lastSeason: number | undefined

  const lineChartData = data?.map(stats => {
    if (stats.season) {
      lastSeason = stats.season
      return { name: stats.season, value: stats.pts }
    }

    if (lastSeason) {
      lastSeason += 1
      return { name: lastSeason, value: 0 }
    }

    return { name: undefined, value: stats.pts }
  })

  const getFormattedCompareGraphData = () => {
    const maxLength = Math.max(...combinedData.map(data => data?.length || 0))

    let i = 0
    const formattedCompareData = []
    while (i < maxLength) {
      const nextItem: Record<string, string | number> = { name: i + 1 }
      combinedData.forEach(playerSeason => {
        if (playerSeason && playerSeason[i] && playerSeason[i][selectedStatCategory]) {
          nextItem[`${selectedStatCategory}-${playerSeason[i].player_id}`] = playerSeason[i][selectedStatCategory]
        } else if (playerSeason && i < playerSeason?.length) {
          nextItem[`${selectedStatCategory}-${playerSeason[i].player_id}`] = 0
        }
      })
      formattedCompareData.push(nextItem)
      i++
    }

    return formattedCompareData
  }

  const formattedCompareData = getFormattedCompareGraphData()

  // console.log(JSON.stringify(lineChartData))

  const handleSelectCategory = (value: keyof PlayerStats) => [
    setSelectedStatCategory(value)
  ]

  return (
    <div>
      <PlayerInfo player={player} />
      <h1 className="text-2xl mb-4 mt-4">Player Stats</h1>
      <div className="flex justify-between items-center mb-4">
        <Select value={selectedStatCategory} onValueChange={handleSelectCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select stat category" />
          </SelectTrigger>
          <SelectContent>
            {statCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer height={300} width="100%">
        <LineChart
          data={formattedCompareData}
          margin={{ top: 5, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {players.map((player, index) => (
            <Line key={player.id} type="monotone" dataKey={`${selectedStatCategory}-${player.id}`} stroke={`${colors[index]}`} />
          ))}
          {/* <Line type="monotone" dataKey="value" stroke="#8884d8" /> */}
          <Legend formatter={(value) => {
            const foundPlayer = players.find(player => player.id === Number(value.split('-')[1]))
            return foundPlayer?.first_name + ' ' + foundPlayer?.last_name
          }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const PlayerInfo: React.FC<{ player: PlayerWithTeam }> = ({ player }) => {

  const infoItems = [
    { title: 'Position', value: player.position || 'N/A' },
    { title: 'Country', value: player.country || 'N/A' },
    { title: 'College', value: player.college || 'N/A' },
    { title: 'Weight', value: player.weight || 'N/A' },
    { title: 'Height', value: player.height || 'N/A' },
    { title: 'Draft Year', value: player.draft_year?.toString() || 'N/A' }
  ]

  const renderInfoItem = (title: string, value: string) => {
    return (
      <div key={title} className="flex flex-col items-start gap">
        <p className="font-semibold text-muted-foreground">{title}</p>
        <p className="text-lg">{value}</p>
      </div>
    )
  }

  return (
    <Card className="w-full p-4">
      <CardContent>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl mb-3">
              {player.first_name + ' ' + player.last_name}
            </h2>
            <Badge className="text-sm">
              {player.team.full_name}
            </Badge>
          </div>
          <div className="grid grid-cols-3 grid-rows-2 w-full gap-2">
            {infoItems.map(item => renderInfoItem(item.title, item.value))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}