import { useQuery } from '@tanstack/react-query'
import { Team } from '@/types'

const getAllTeams = async (): Promise<{ data: Team[] }> => {
  const url = 'https://api.balldontlie.io/v1/teams'
  const response = await fetch(url, {
    headers: {
      "Authorization": import.meta.env.VITE_BALL_DONT_LIE_API_KEY
    }
  })
  const jsonResponse = await response.json()
  return jsonResponse
}

export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: getAllTeams,
    staleTime: 60 * 1000 * 30
  })
}