import React from 'react';
import { X } from 'lucide-react';
import { Card } from '../../common/Card';
import { PokemonTypes } from '../../pokemon/PokemonTypes';
import { PokemonAnimation } from '../../pokemon/PokemonAnimation';
import type { Pokemon } from '../../../types/pokemon';
import './style.css';

interface CompareCardProps {
  pokemon: Pokemon;
  onRemove?: () => void;
}

export const CompareCard: React.FC<CompareCardProps> = ({ pokemon, onRemove }) => {
  if (!pokemon) return null;

  const totalStats = pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);

  return (
    <Card className="compare-card" padding="md">
      {onRemove && (
        <button className="remove-btn" onClick={onRemove} aria-label="Remover Pokémon">
          <X size={18} />
        </button>
      )}

      <div className="compare-card-content">
        <PokemonAnimation id={pokemon.id} name={pokemon.name} size={210} />

        <div className="pokemon-info">
          <span className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</span>
          <h3 className="pokemon-name">{pokemon.name}</h3>
          <PokemonTypes types={pokemon.types} size="md" />
        </div>

        <div className="compare-card-metrics">
          <div>
            <span>Total</span>
            <strong>{totalStats}</strong>
          </div>
          <div>
            <span>Altura</span>
            <strong>{pokemon.height / 10} m</strong>
          </div>
          <div>
            <span>Peso</span>
            <strong>{pokemon.weight / 10} kg</strong>
          </div>
        </div>
      </div>
    </Card>
  );
};
