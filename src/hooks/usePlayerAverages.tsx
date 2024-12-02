import { useQuery, useQueries } from '@tanstack/react-query'
import { PlayerStats } from '@/types'

const getPlayerAverages = async (startSeason: number, playerId: number) => {

  const currYear = new Date().getFullYear()
  let numGapYears = 0
  let allSeasonData = []
  for (let i = startSeason; i < currYear; i++) {
    console.log(currYear, i)
    const url = `https://api.balldontlie.io/v1/season_averages?season=${i}&player_id=${playerId}`
    const seasonData = await fetch(url, {
      headers: {
        "Authorization": import.meta.env.VITE_BALL_DONT_LIE_API_KEY
      }
    })
    const jsonSeasonData = await seasonData.json()
    const newSeasonData: PlayerStats[] = jsonSeasonData.data
    console.log('newSeasonData', newSeasonData, newSeasonData[0])
    if (!newSeasonData.length) {
      numGapYears++
    } else {
      numGapYears = 0
    }

    if (numGapYears > 3) {
      allSeasonData = allSeasonData.slice(0, allSeasonData.length - 3)
      console.log()
      break
    }

    if (!newSeasonData.length && !allSeasonData.length) continue

    allSeasonData.push(newSeasonData[0] || {})
    console.log('seasonData', newSeasonData)
  }

  console.log("allSeasonData", allSeasonData)
  return allSeasonData
}

export const usePlayerAverages = (startSeason: number, playerId: number) => {
  return useQuery({
    queryFn: () => getPlayerAverages(startSeason, playerId),
    queryKey: ['player_averages', playerId],
    staleTime: Infinity
  })
}

export const useCombinedAverages = (args: { startSeason: number, playerId: number }[]) => {
  return useQueries({
    queries: args.map(({ startSeason, playerId }) => ({
      queryKey: ['player_averages', playerId],
      queryFn: () => getPlayerAverages(startSeason, playerId),
      staleTime: Infinity
    })),
    combine: (results) => ({
      data: results.map(res => res.data),
      pending: results.some((result) => result.isPending)
    })
  })
}