import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { pokemonService } from '../../../services/pokemonService';
import { formatPokemonId } from '../../../utils/formatPokemonId';
import './style.css';

interface PokemonBasicInfo {
  name: string;
  id: number;
}

interface AutocompleteInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSelect?: (pokemon: PokemonBasicInfo) => void;
  onEnter?: () => void;
  className?: string;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  placeholder,
  value,
  onChange,
  onSelect,
  onEnter,
  className = '',
}) => {
  const [allPokemons, setAllPokemons] = useState<PokemonBasicInfo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await pokemonService.getAllPokemons();
        setAllPokemons(data);
      } catch (error) {
        console.error('Error fetching all pokemons for autocomplete:', error);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = React.useMemo(() => {
    if (value.length >= 1 && allPokemons.length > 0) {
      return allPokemons
        .filter(p => 
          p.name.toLowerCase().startsWith(value.toLowerCase()) || 
          p.id.toString().startsWith(value)
        )
        .slice(0, 5);
    }
    return [];
  }, [value, allPokemons]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (newValue.length >= 1) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleInputFocus = () => {
    if (value.length >= 1) {
      setShowSuggestions(true);
    }
  };

  const handleSelect = (pokemon: PokemonBasicInfo) => {
    onChange(pokemon.name);
    setShowSuggestions(false);
    if (onSelect) onSelect(pokemon);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      if (onEnter) onEnter();
    }
  };

  return (
    <div className={`autocomplete-container ${className}`} ref={containerRef}>
      <div className="autocomplete-wrapper">
        <span className="autocomplete-icon"><Search size={18} /></span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={handleInputFocus}
          className="autocomplete-field"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((pokemon) => (
            <li 
              key={pokemon.id} 
              onClick={() => handleSelect(pokemon)}
              className="suggestion-item"
            >
              <span className="suggestion-id">{formatPokemonId(pokemon.id)}</span>
              <span className="suggestion-name">{pokemon.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
