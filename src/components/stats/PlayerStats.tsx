import React from "react";
import { usePlayerAverages } from '@/hooks/usePlayerAverages'
import { PlayerWithTeam } from '@/types'
import { LineChart, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer, Line } from 'recharts'

interface PlayerStatsProps {
  player: PlayerWithTeam
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {

  const { id, draft_year } = player

  const { data, isLoading } = usePlayerAverages(draft_year || 2024, id)

  console.log('PlayerStats', data, isLoading)

  // const [lineChartData, setLineChartData] = useState<{ name: string, value: number }[]>([])

  const lineChartData = data?.map(stats => ({ name: stats.season, value: stats.pts }))

  console.log(lineChartData)

  return (
    <div>
      <h1 className="text-2xl">Player Stats</h1>
      <ResponsiveContainer height={300} width="100%">
        <LineChart
          data={lineChartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis dataKey="value" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}