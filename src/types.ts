export interface Player {
  id: number;
  team_id: number;
  college: string;
  country: string;
  draft_number: number | null;
  draft_round: number | null;
  draft_year: number | null;
  first_name: string;
  last_name: string;
  height: string;
  position: string;
  weight: string
}

type InjuryStatus = "Day-To-Day" | "Out"

export interface Injury {
  description: string;
  return_date: string;
  status: InjuryStatus;
  player: Player;
}

export interface Team {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
}

export interface PlayerWithTeam extends Player {
  team: Team
}

export interface PlayerStats {
  ast: number;        // Assists per game
  blk: number;        // Blocks per game
  dreb: number;       // Defensive rebounds per game
  fg3_pct: number;    // Three-point field goal percentage
  fg3a: number;       // Three-point field goals attempted per game
  fg3m: number;       // Three-point field goals made per game
  fg_pct: number;     // Field goal percentage
  fga: number;        // Field goals attempted per game
  fgm: number;        // Field goals made per game
  ft_pct: number;     // Free throw percentage
  fta: number;        // Free throws attempted per game
  ftm: number;        // Free throws made per game
  games_played: number; // Number of games played
  min: string;        // Average minutes played per game (formatted as "MM:SS")
  oreb: number;       // Offensive rebounds per game
  pf: number;         // Personal fouls per game
  player_id: number;  // Player ID
  pts: number;        // Points per game
  reb: number;        // Rebounds per game
  season: number;     // Season year
  stl: number;        // Steals per game
}