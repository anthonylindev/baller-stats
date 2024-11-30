import { useTeams } from './useTeams'
import { useInjuries } from './useInjuries';
import { Team, Injury } from '@/types'

interface InjuriesByTeam {
  team: Team;
  injuries: Injury[];
}

export const useInjuriesByTeam = () => {
  const { data: teams, isLoading: teamsIsLoading } = useTeams()
  const { data: injuries, isLoading: injuriesIsLoading } = useInjuries()

  if (teamsIsLoading || injuriesIsLoading) {
    return { data: null, isLoading: true, error: null }
  }

  if (!teams || !injuries) {
    return { data: null, isLoading: false, error: 'Failed to load data' }
  }

  const activeTeams = teams?.data.filter(team => !!team.division)

  const teamMap = activeTeams.reduce((acc, team) => {
    acc[team.id] = team
    return acc
  }, {} as Record<number, Team>)

  const injuriesByTeam = injuries.reduce((acc, injury) => {
    const teamId = injury.player.team_id
    if (!acc[teamId]) {
      acc[teamId] = { team: teamMap[teamId], injuries: [] }
    }
    acc[teamId].injuries.push(injury)
    return acc
  }, {} as Record<number, InjuriesByTeam>)

  const values = Object.values(injuriesByTeam)

  return { data: values, isLoading: false, error: null }
}