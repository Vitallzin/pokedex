import React from 'react';
import type { PokemonType } from '../../../types/pokemon';
import './style.css';

interface PokemonTypesProps {
  types: PokemonType[];
  size?: 'sm' | 'md' | 'lg';
}

export const PokemonTypes: React.FC<PokemonTypesProps> = ({ types, size = 'md' }) => {
  return (
    <div className={`pokemon-types-container types-${size}`}>
      {types.map((type) => (
        <span 
          key={type.type.name} 
          className={`type-badge-large ${type.type.name}`}
        >
          <img 
            src={`/icons.svg#${type.type.name}`} 
            alt={type.type.name} 
            className="type-icon" 
          />
          {type.type.name}
        </span>
      ))}
    </div>
  );
};
