import React, { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import type { Pokemon } from '../types/pokemon';
import { db } from '../services/firebase';
import { TeamContext, type Team } from './teamContextValue';

const MAX_TEAMS = 10;
const MAX_POKEMON_PER_TEAM = 6;

const getLegacyTeams = (userId: string) => {
  const saved = localStorage.getItem(`teams_${userId}`);
  return saved ? JSON.parse(saved) as Team[] : [];
};

const sanitizeTeams = (teams: Team[]) =>
  JSON.parse(JSON.stringify(teams)) as Team[];

const getTeamsRef = (userId: string) => {
  if (!db) return null;
  return doc(db, 'users', userId, 'teams', 'current');
};

const normalizeTeams = (teams: Team[]) =>
  teams.slice(0, MAX_TEAMS).map(team => ({
    ...team,
    pokemons: team.pokemons.slice(0, MAX_POKEMON_PER_TEAM),
  }));

const saveTeams = async (userId: string, teams: Team[]) => {
  const teamsRef = getTeamsRef(userId);
  if (!teamsRef) return;

  await setDoc(teamsRef, {
    items: sanitizeTeams(normalizeTeams(teams)),
    updatedAt: serverTimestamp(),
  });
};

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [teamsByUser, setTeamsByUser] = useState<Record<string, Team[]>>({});
  const teams = user ? teamsByUser[user.id] ?? [] : [];

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const loadTeams = async () => {
      const teamsRef = getTeamsRef(user.id);
      const legacyTeams = normalizeTeams(getLegacyTeams(user.id));

      if (!teamsRef) {
        if (isMounted) {
          setTeamsByUser(prev => ({ ...prev, [user.id]: legacyTeams }));
        }
        return;
      }

      const snapshot = await getDoc(teamsRef);
      const remoteTeams = snapshot.exists()
        ? (snapshot.data().items as Team[] | undefined) ?? []
        : legacyTeams;

      const safeTeams = normalizeTeams(remoteTeams);

      if (!snapshot.exists() && legacyTeams.length > 0) {
        await saveTeams(user.id, safeTeams);
      }

      localStorage.removeItem(`teams_${user.id}`);

      if (isMounted) {
        setTeamsByUser(prev => ({ ...prev, [user.id]: safeTeams }));
      }
    };

    void loadTeams();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const addTeam = (name: string) => {
    if (!user || teams.length >= MAX_TEAMS) return;

    const newTeam = { id: crypto.randomUUID(), name, pokemons: [] };
    const updated = normalizeTeams([...teams, newTeam]);

    setTeamsByUser(prev => ({ ...prev, [user.id]: updated }));
    void saveTeams(user.id, updated);
  };

  const addToTeam = (teamId: string, pokemon: Pokemon) => {
    if (!user) return;

    const updated = teams.map(team => {
      if (team.id !== teamId || team.pokemons.length >= MAX_POKEMON_PER_TEAM) {
        return team;
      }

      if (team.pokemons.some(teamPokemon => teamPokemon.id === pokemon.id)) {
        return team;
      }

      return { ...team, pokemons: [...team.pokemons, pokemon] };
    });

    setTeamsByUser(prev => ({ ...prev, [user.id]: updated }));
    void saveTeams(user.id, updated);
  };

  const removeFromTeam = (teamId: string, pokemonId: number) => {
    if (!user) return;

    const updated = teams.map(team => {
      if (team.id === teamId) {
        return { ...team, pokemons: team.pokemons.filter(pokemon => pokemon.id !== pokemonId) };
      }

      return team;
    });

    setTeamsByUser(prev => ({ ...prev, [user.id]: updated }));
    void saveTeams(user.id, updated);
  };

  const deleteTeam = (teamId: string) => {
    if (!user) return;

    const updated = teams.filter(team => team.id !== teamId);
    setTeamsByUser(prev => ({ ...prev, [user.id]: updated }));
    void saveTeams(user.id, updated);
  };

  return (
    <TeamContext.Provider value={{
      teams,
      maxTeams: MAX_TEAMS,
      addTeam,
      deleteTeam,
      addToTeam,
      removeFromTeam
    }}>
      {children}
    </TeamContext.Provider>
  );
};
