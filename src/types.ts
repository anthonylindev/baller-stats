export interface Player {
  id: number;
  team_id: number;
  college: string;
  country: string;
  draft_number: number;
  draft_round: number;
  draft_year: number;
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