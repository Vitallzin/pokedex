import { createContext } from 'react';
import type { Pokemon } from '../types/pokemon';

export interface Team {
  id: string;
  name: string;
  pokemons: Pokemon[];
}

export interface TeamContextType {
  teams: Team[];
  maxTeams: number;
  addTeam: (name: string) => void;
  deleteTeam: (teamId: string) => void;
  addToTeam: (teamId: string, pokemon: Pokemon) => void;
  removeFromTeam: (teamId: string, pokemonId: number) => void;
}

export const TeamContext = createContext<TeamContextType | undefined>(undefined);
