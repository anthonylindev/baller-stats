import { PlayerWithTeam } from '@/types'

export const getPlayersByQuery = async (query: string, cursor?: number): Promise<{ data: PlayerWithTeam[], meta: { per_page: number, next_cursor: number } }> => {
  let url = `https://api.balldontlie.io/v1/players?search=${query}${cursor ? '?cursor=' + cursor : ''}&per_page=8`
  const splitQuery = query.split(' ')
  if (splitQuery.length >= 2) {
    url = `https://api.balldontlie.io/v1/players?first_name=${splitQuery[0]}&last_name=${splitQuery[1]}${cursor ? '?cursor=' + cursor : ''}&per_page=8`
  }
  console.log('query', url)
  const playerData = await fetch(url, {
    headers: {
      "Authorization": import.meta.env.VITE_BALL_DONT_LIE_API_KEY
    }
  })

  const jsonPlayerData = await playerData.json()
  return jsonPlayerData
}