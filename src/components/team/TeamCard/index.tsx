import React from 'react';
import { Card } from '../../common/Card';
import { TeamSlot } from '../TeamSlot';
import { Button } from '../../common/Button';
import { Trash2, Edit2 } from 'lucide-react';
import { useTeam } from '../../../hooks/useTeam';
import type { Pokemon } from '../../../types/pokemon';
import './style.css';

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    pokemons: Pokemon[];
  };
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onDelete, onEdit }) => {
  const { removeFromTeam } = useTeam();

  const handleRemovePokemon = (pokemonId: number) => {
    removeFromTeam(team.id, pokemonId);
  };

  return (
    <Card className="team-card" padding="none">
      <div className="team-card-header">
        <h3 className="team-name">{team.name}</h3>
        <div className="team-actions">
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(team.id)}>
              <Edit2 size={16} />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={() => onDelete(team.id)} className="delete-btn">
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>
      
      <div className="team-slots">
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const pokemon = team.pokemons[index];
          return (
            <TeamSlot 
              key={index} 
              pokemon={pokemon} 
              onRemove={pokemon ? () => handleRemovePokemon(pokemon.id) : undefined}
            />
          );
        })}
      </div>
      
      <div className="team-card-footer">
        <span className="pokemon-count">{team.pokemons.length} / 6 Pokémons</span>
      </div>
    </Card>
  );
};
