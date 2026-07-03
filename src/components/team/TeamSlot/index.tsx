import React from 'react';
import { Plus, X } from 'lucide-react';
import type { Pokemon } from '../../../types/pokemon';
import './style.css';

interface TeamSlotProps {
  pokemon?: Pokemon;
  onClick?: () => void;
  onRemove?: () => void;
}

export const TeamSlot: React.FC<TeamSlotProps> = ({ pokemon, onClick, onRemove }) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) onRemove();
  };

  return (
    <div className={`team-slot ${!pokemon ? 'empty' : ''}`} onClick={onClick}>
      {pokemon ? (
        <div className="slot-content">
          <button className="remove-pokemon" onClick={handleRemove}>
            <X size={14} />
          </button>
          <img 
            src={pokemon.sprites?.front_default} 
            alt={pokemon.name} 
            className="slot-image" 
          />
          <span className="slot-name">{pokemon.name}</span>
        </div>
      ) : (
        <div className="slot-empty">
          <Plus size={24} />
        </div>
      )}
    </div>
  );
};
