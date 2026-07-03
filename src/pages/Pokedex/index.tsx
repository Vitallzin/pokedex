import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { pokemonService } from '../../services/pokemonService';
import { PokemonCard } from '../../components/pokemon/PokemonCard';
import { Loader } from '../../components/common/Loader';
import { Input } from '../../components/common/Input';
import { useFavorites } from '../../hooks/useFavorites';
import { pokemonTypes, translateType, typeColors } from '../../data/pokemonTypes';
import type { Pokemon } from '../../types/pokemon';
import './style.css';

interface PokemonBasicInfo {
  name: string;
  id: number;
}

type SortOption = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc' | 'height-desc' | 'weight-desc' | 'experience-desc';

const FILTER_BATCH_SIZE = 40;

const generationRanges = [
  { value: '1', label: 'Geração I', min: 1, max: 151 },
  { value: '2', label: 'Geração II', min: 152, max: 251 },
  { value: '3', label: 'Geração III', min: 252, max: 386 },
  { value: '4', label: 'Geração IV', min: 387, max: 493 },
  { value: '5', label: 'Geração V', min: 494, max: 649 },
  { value: '6', label: 'Geração VI', min: 650, max: 721 },
  { value: '7', label: 'Geração VII', min: 722, max: 809 },
  { value: '8', label: 'Geração VIII', min: 810, max: 905 },
  { value: '9', label: 'Geração IX', min: 906, max: 1025 },
];

const sortLabels: Record<SortOption, string> = {
  'id-asc': 'Menor número',
  'id-desc': 'Maior número',
  'name-asc': 'Nome A-Z',
  'name-desc': 'Nome Z-A',
  'height-desc': 'Mais altos',
  'weight-desc': 'Mais pesados',
  'experience-desc': 'Mais experiência',
};

const sortPokemons = (items: Pokemon[], sortOption: SortOption) => {
  return [...items].sort((a, b) => {
    switch (sortOption) {
      case 'id-desc':
        return b.id - a.id;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'height-desc':
        return b.height - a.height;
      case 'weight-desc':
        return b.weight - a.weight;
      case 'experience-desc':
        return b.base_experience - a.base_experience;
      default:
        return a.id - b.id;
    }
  });
};

const sortBasicPokemons = (items: PokemonBasicInfo[], sortOption: SortOption) => {
  return [...items].sort((a, b) => {
    switch (sortOption) {
      case 'id-desc':
        return b.id - a.id;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return a.id - b.id;
    }
  });
};

export const Pokedex: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [allPokemons, setAllPokemons] = useState<PokemonBasicInfo[]>([]);
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('id-asc');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [typePokemonIds, setTypePokemonIds] = useState<number[] | null>(null);
  const [filterLimit, setFilterLimit] = useState(FILTER_BATCH_SIZE);
  const [filteredCandidateCount, setFilteredCandidateCount] = useState(0);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { favorites } = useFavorites();

  const selectedGenerationRange = generationRanges.find(generation => generation.value === selectedGeneration);
  const hasFilters = Boolean(searchQuery.trim() || selectedType || selectedGeneration || favoritesOnly || sortOption !== 'id-asc');
  const hasVisibleFilterChips = Boolean(selectedType || selectedGenerationRange || favoritesOnly || sortOption !== 'id-asc');
  const usesRemoteFilters = Boolean(searchQuery.trim() || selectedType || selectedGeneration || sortOption !== 'id-asc');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await pokemonService.getAllPokemons();
        setAllPokemons(data);
      } catch (error) {
        console.error('Error fetching all pokemons:', error);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setLoading(true);
        const data = await pokemonService.getPokemonList(20, offset);

        setPokemons(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newPokemons = data.results.filter(p => !existingIds.has(p.id));
          return [...prev, ...newPokemons];
        });
      } catch (error) {
        console.error('Error fetching pokemons:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!usesRemoteFilters && !favoritesOnly) {
      fetchPokemons();
    }
  }, [offset, usesRemoteFilters, favoritesOnly]);

  useEffect(() => {
    setFilterLimit(FILTER_BATCH_SIZE);
  }, [searchQuery, selectedType, selectedGeneration, sortOption, favoritesOnly]);

  useEffect(() => {
    if (!selectedType) {
      setTypePokemonIds(null);
      return;
    }

    const fetchTypeIds = async () => {
      try {
        setSearching(true);
        const ids = await pokemonService.getPokemonIdsByType(selectedType);
        setTypePokemonIds(ids);
      } catch (error) {
        console.error('Error fetching pokemon type ids:', error);
      } finally {
        setSearching(false);
      }
    };

    fetchTypeIds();
  }, [selectedType]);

  const filteredFavorites = useMemo(() => {
    const typeIds = new Set(typePokemonIds ?? []);
    const query = searchQuery.trim().toLowerCase();
    const filtered = favorites.filter(pokemon => {
      const matchesSearch = !query || pokemon.name.toLowerCase().includes(query) || pokemon.id.toString().includes(query);
      const matchesType = !selectedType || typeIds.has(pokemon.id);
      const matchesGeneration = !selectedGenerationRange || (
        pokemon.id >= selectedGenerationRange.min && pokemon.id <= selectedGenerationRange.max
      );

      return matchesSearch && matchesType && matchesGeneration;
    });

    return sortPokemons(filtered, sortOption);
  }, [favorites, searchQuery, selectedType, selectedGenerationRange, sortOption, typePokemonIds]);

  useEffect(() => {
    if (!usesRemoteFilters || favoritesOnly) {
      setSearchResults([]);
      setFilteredCandidateCount(0);
      return;
    }

    if (selectedType && !typePokemonIds) {
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const query = searchQuery.trim().toLowerCase();
        const typeIds = new Set(typePokemonIds ?? []);
        const candidates = allPokemons.filter(pokemon => {
          const matchesSearch = !query || pokemon.name.toLowerCase().includes(query) || pokemon.id.toString().includes(query);
          const matchesType = !selectedType || typeIds.has(pokemon.id);
          const matchesGeneration = !selectedGenerationRange || (
            pokemon.id >= selectedGenerationRange.min && pokemon.id <= selectedGenerationRange.max
          );

          return matchesSearch && matchesType && matchesGeneration;
        });

        const sortedCandidates = sortBasicPokemons(candidates, sortOption);
        setFilteredCandidateCount(sortedCandidates.length);

        const details = await Promise.all(
          sortedCandidates
            .slice(0, filterLimit)
            .map(pokemon => pokemonService.getPokemon(pokemon.id))
        );

        setSearchResults(sortPokemons(details, sortOption));
      } catch (error) {
        console.error('Error filtering pokemons:', error);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [
    allPokemons,
    filterLimit,
    favoritesOnly,
    searchQuery,
    selectedGenerationRange,
    selectedType,
    sortOption,
    typePokemonIds,
    usesRemoteFilters,
  ]);

  const handleLoadMore = useCallback(() => {
    if (usesRemoteFilters) {
      setFilterLimit(prev => prev + FILTER_BATCH_SIZE);
      return;
    }

    setOffset(prev => prev + 20);
  }, [usesRemoteFilters]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedGeneration('');
    setSortOption('id-asc');
    setFavoritesOnly(false);
  };

  const displayedPokemons = favoritesOnly
    ? filteredFavorites
    : usesRemoteFilters
      ? searchResults
      : sortPokemons(pokemons, sortOption);

  const canLoadMore = !favoritesOnly && (
    usesRemoteFilters
      ? searchResults.length < filteredCandidateCount
      : !allPokemons.length || pokemons.length < allPokemons.length
  );

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !canLoadMore || loading || searching) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: '420px 0px' }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [canLoadMore, displayedPokemons.length, handleLoadMore, loading, searching]);

  return (
    <div className="pokedex-page">
      <section className="pokedex-toolbar" aria-label="Busca e filtros da Pokédex">
        <div className="search-container">
          <Input
            placeholder="Pesquisar por nome ou número..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={20} />}
            className="pokedex-search"
          />
        </div>

        <div className="filters-shell">
          <div className="filters-header">
            <div className="filters-title">
              <SlidersHorizontal size={18} />
              <span>Filtros</span>
            </div>

            {hasFilters && (
              <button className="clear-filters" onClick={clearFilters}>
                <X size={16} />
                Limpar
              </button>
            )}
          </div>

          <div className="filters-grid">
            <label className="filter-control">
              <span>Tipo</span>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="">Todos os tipos</option>
                {pokemonTypes.map(type => (
                  <option key={type} value={type}>{translateType[type]}</option>
                ))}
              </select>
            </label>

            <label className="filter-control">
              <span>Geração</span>
              <select value={selectedGeneration} onChange={(e) => setSelectedGeneration(e.target.value)}>
                <option value="">Todas as gerações</option>
                {generationRanges.map(generation => (
                  <option key={generation.value} value={generation.value}>{generation.label}</option>
                ))}
              </select>
            </label>

            <label className="filter-control">
              <span>Ordenar por</span>
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)}>
                {Object.entries(sortLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label className="favorite-filter">
              <input
                type="checkbox"
                checked={favoritesOnly}
                onChange={(e) => setFavoritesOnly(e.target.checked)}
              />
              <span>Mostrar apenas favoritos</span>
            </label>
          </div>

          {hasVisibleFilterChips && (
            <div className="active-filters" aria-live="polite">
              {selectedType && (
                <span className="filter-chip" style={{ borderColor: typeColors[selectedType] }}>
                  {translateType[selectedType]}
                </span>
              )}
              {selectedGenerationRange && <span className="filter-chip">{selectedGenerationRange.label}</span>}
              {sortOption !== 'id-asc' && <span className="filter-chip">{sortLabels[sortOption]}</span>}
              {favoritesOnly && <span className="filter-chip">Favoritos</span>}
            </div>
          )}
        </div>
      </section>

      <div className="pokemon-grid">
        {displayedPokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      <div ref={loadMoreRef} className="load-more-sentinel" aria-hidden="true" />

      {searching || (loading && !usesRemoteFilters && !favoritesOnly) ? (
        <Loader />
      ) : null}

      {hasFilters && !searching && displayedPokemons.length === 0 && (
        <div className="no-results">
          Nenhum Pokémon encontrado com esses filtros.
        </div>
      )}
    </div>
  );
};
