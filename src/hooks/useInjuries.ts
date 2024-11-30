import { useQuery } from '@tanstack/react-query'
import { Injury } from '@/types'

const fetchAllPlayerInjuries = async (): Promise<Injury[]> => {
  const allInjuries = [];
  let nextCursor: number | null = null;

  do {
    const injuriesUrl = `https://api.balldontlie.io/v1/player_injuries?per_page=100${nextCursor ? `&cursor=${nextCursor}` : ''}`

    const response = await fetch(injuriesUrl, {
      headers: {
        "Authorization": import.meta.env.VITE_BALL_DONT_LIE_API_KEY
      }
    })

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data: {
      data: Injury[],
      meta: {
        next_cursor?: number;
        prev_cursor?: number
      }
    } = await response.json();

    allInjuries.push(...data.data);

    nextCursor = data.meta.next_cursor || null;
  } while (nextCursor);

  return allInjuries;
};

export const useInjuries = () => {
  return useQuery({
    queryFn: fetchAllPlayerInjuries,
    queryKey: ['injuries'],
    staleTime: 0
  })
}