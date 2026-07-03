import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RotateCcw, Swords } from 'lucide-react';
import { pokemonService } from '../../services/pokemonService';
import { CompareStats } from '../../components/comparison/CompareStats';
import { BattleAnalysis } from '../../components/comparison/BattleAnalysis';
import { CompareCard } from '../../components/comparison/CompareCard';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { AutocompleteInput } from '../../components/common/AutocompleteInput';
import type { Pokemon } from '../../types/pokemon';
import './style.css';

type CompareSlot = 'first' | 'second';

export const Comparison: React.FC = () => {
  const [pokemon1, setPokemon1] = useState<Pokemon | null>(null);
  const [pokemon2, setPokemon2] = useState<Pokemon | null>(null);
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latestRequest = useRef({ first: '', second: '' });

  const fetchPokemon = useCallback(async (value: string, slot: CompareSlot) => {
    const query = value.trim().toLowerCase();

    if (!query) {
      if (slot === 'first') setPokemon1(null);
      if (slot === 'second') setPokemon2(null);
      return;
    }

    latestRequest.current[slot] = query;
    if (slot === 'first') setLoading1(true);
    if (slot === 'second') setLoading2(true);

    try {
      const data = await pokemonService.getPokemonDetail(query);

      if (latestRequest.current[slot] !== query) {
        return;
      }

      if (slot === 'first') setPokemon1(data as unknown as Pokemon);
      if (slot === 'second') setPokemon2(data as unknown as Pokemon);
      setError(null);
    } catch (err) {
      console.error('Error fetching pokemon for comparison:', err);

      if (latestRequest.current[slot] !== query) {
        return;
      }

      if (slot === 'first') setPokemon1(null);
      if (slot === 'second') setPokemon2(null);
      setError('Pokémon não encontrado. Verifique o nome ou número.');
    } finally {
      if (latestRequest.current[slot] === query) {
        if (slot === 'first') setLoading1(false);
        if (slot === 'second') setLoading2(false);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPokemon(search1, 'first');
    }, 450);

    return () => clearTimeout(timer);
  }, [fetchPokemon, search1]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPokemon(search2, 'second');
    }, 450);

    return () => clearTimeout(timer);
  }, [fetchPokemon, search2]);

  const handleReset = () => {
    setPokemon1(null);
    setPokemon2(null);
    setSearch1('');
    setSearch2('');
    setError(null);
  };

  const handleRemove1 = () => {
    setPokemon1(null);
    setSearch1('');
  };

  const handleRemove2 = () => {
    setPokemon2(null);
    setSearch2('');
  };

  const isLoading = loading1 || loading2;

  return (
    <div className="comparison-page">
      <header className="comparison-header">
        <span className="comparison-kicker">Modo comparação</span>
        <h1>Comparação de Batalha</h1>
        <p>Escolha dois Pokémon para comparar status, tipos e vantagem estratégica.</p>
      </header>

      <div className="selection-container">
        <div className="search-inputs">
          <label className="comparison-field">
            <span>Primeiro Pokémon</span>
            <AutocompleteInput
              placeholder="Nome ou número"
              value={search1}
              onChange={setSearch1}
              onSelect={(pokemon) => fetchPokemon(pokemon.name, 'first')}
              onEnter={() => fetchPokemon(search1, 'first')}
              className="search-input"
            />
          </label>

          <div className="vs-divider" aria-hidden="true">
            <Swords size={24} />
          </div>

          <label className="comparison-field">
            <span>Segundo Pokémon</span>
            <AutocompleteInput
              placeholder="Nome ou número"
              value={search2}
              onChange={setSearch2}
              onSelect={(pokemon) => fetchPokemon(pokemon.name, 'second')}
              onEnter={() => fetchPokemon(search2, 'second')}
              className="search-input"
            />
          </label>
        </div>

        {(pokemon1 || pokemon2) && (
          <div className="action-buttons">
            <Button
              variant="ghost"
              onClick={handleReset}
              icon={<RotateCcw size={18} />}
              className="reset-btn"
            >
              Limpar tudo
            </Button>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="comparison-results">
        {(pokemon1 || pokemon2 || isLoading) ? (
          <div className="results-content">
            <div className="pokemon-cards-grid">
              {pokemon1 ? (
                <CompareCard pokemon={pokemon1} onRemove={handleRemove1} />
              ) : (
                <div className="empty-slot">
                  {loading1 ? <Loader /> : 'Aguardando Pokémon 1...'}
                </div>
              )}

              <div className="vs-large">VS</div>

              {pokemon2 ? (
                <CompareCard pokemon={pokemon2} onRemove={handleRemove2} />
              ) : (
                <div className="empty-slot">
                  {loading2 ? <Loader /> : 'Aguardando Pokémon 2...'}
                </div>
              )}
            </div>

            {pokemon1 && pokemon2 && (
              <>
                <section className="analysis-section">
                  <div className="section-title">
                    <div className="title-line"></div>
                    <h3>Estatísticas Base</h3>
                    <div className="title-line"></div>
                  </div>
                  <CompareStats p1={pokemon1} p2={pokemon2} />
                </section>

                <section className="analysis-section">
                  <div className="section-title">
                    <div className="title-line"></div>
                    <h3>Análise de Tipo e Fraquezas</h3>
                    <div className="title-line"></div>
                  </div>
                  <BattleAnalysis p1={pokemon1} p2={pokemon2} />
                </section>
              </>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Swords size={56} />
            </div>
            <h3>Pronto para o duelo?</h3>
            <p>Digite ou selecione dois Pokémon acima para ver a comparação aparecer automaticamente.</p>
          </div>
        )}
      </div>
    </div>
  );
};
