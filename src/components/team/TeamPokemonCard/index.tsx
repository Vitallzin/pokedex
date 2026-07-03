import React from 'react';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Plus, Trash2 } from 'lucide-react';
import type { Pokemon, PokemonType } from '../../../types/pokemon';
import './style.css';

interface TeamPokemonCardProps {
  pokemon: Pokemon;
  onAdd?: (pokemon: Pokemon) => void;
  onRemove?: (pokemonId: number) => void;
  isAdded?: boolean;
}

export const TeamPokemonCard: React.FC<TeamPokemonCardProps> = ({ 
  pokemon, 
  onAdd, 
  onRemove,
  isAdded = false
}) => {
  return (
    <Card className="team-pokemon-card" padding="sm">
      <div className="pokemon-info">
        <img 
          src={pokemon.sprites?.front_default} 
          alt={pokemon.name} 
          className="pokemon-image"
        />
        <div className="pokemon-details">
          <span className="pokemon-name">{pokemon.name}</span>
          <div className="pokemon-types">
            {pokemon.types?.map((type: PokemonType) => (
              <span key={type.type.name} className={`type-badge ${type.type.name}`}>
                {type.type.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="card-actions">
        {isAdded ? (
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => onRemove?.(pokemon.id)}
            icon={<Trash2 size={14} />}
          >
            Remover
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onAdd?.(pokemon)}
            icon={<Plus size={14} />}
          >
            Adicionar
          </Button>
        )}
      </div>
    </Card>
  );
};
