import React from "react";
import { usePlayerAverages, useCombinedAverages } from '@/hooks/usePlayerAverages'
import { PlayerWithTeam } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { LineChart, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer, Line } from 'recharts'

interface PlayerStatsProps {
  player: PlayerWithTeam
  players: PlayerWithTeam[]
}

const colors = ['#716cd8', '#d86cbd', '#d89c6c', '#92d86c', '#6cd8c8'];

export const PlayerStats: React.FC<PlayerStatsProps> = ({ player, players }) => {

  const { id, draft_year } = player

  const { data, isLoading } = usePlayerAverages(draft_year || 2024, id)

  const combinedQueryParams = players.map(player => ({ startSeason: player.draft_year || 2024, playerId: player.id }))

  const { data: combinedData } = useCombinedAverages(combinedQueryParams)

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
        if (playerSeason && playerSeason[i] && playerSeason[i].pts) {
          nextItem[`pts-${playerSeason[i].player_id}`] = playerSeason[i].pts
        } else {
          // nextItem[`pts-${playerSeason[i].player_id}`] = 0
        }
      })
      formattedCompareData.push(nextItem)
      i++
    }

    return formattedCompareData
  }

  const formattedCompareData = getFormattedCompareGraphData()

  console.log(JSON.stringify(lineChartData))

  return (
    <div>
      <PlayerInfo player={player} />
      <h1 className="text-2xl mb-4 mt-4">Player Stats</h1>
      <ResponsiveContainer height={300} width="100%">
        <LineChart
          data={formattedCompareData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {players.map((player, index) => (
            <Line key={player.id} type="monotone" dataKey={`pts-${player.id}`} stroke={`${colors[index]}`} />
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