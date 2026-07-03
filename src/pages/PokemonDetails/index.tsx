import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pokemonService } from '../../services/pokemonService';
import { PokemonStats } from '../../components/pokemon/PokemonStats';
import { EvolutionChain } from '../../components/pokemon/EvolutionChain';
import { SimilarPokemons } from '../../components/pokemon/SimilarPokemons';
import { Loader } from '../../components/common/Loader';
import { typeColors, translateType, translateAbility } from '../../data/pokemonTypes';
import { formatPokemonId } from '../../utils/formatPokemonId';
import { Heart, Plus, ChevronLeft } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { useTeam } from '../../hooks/useTeam';
import { useAuth } from '../../hooks/useAuth';
import type { PokemonDetail, PokemonType, PokemonAbility, Pokemon } from '../../types/pokemon';

import './style.css';

export const PokemonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { teams, addToTeam } = useTeam();
  const { isAuthenticated } = useAuth();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTeamSelect, setShowTeamSelect] = useState(false);

  // ... useEffect stays same ...
  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await pokemonService.getPokemonDetail(id);
        setPokemon(data);
      } catch (error) {
        console.error('Error fetching pokemon detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loader />;
  if (!pokemon) return <div>Pokemon não encontrado</div>;

  const mainType = pokemon.types[0].type.name;

  const handleToggleFavorite = () => {
    if (!isAuthenticated) return navigate('/login');
    toggleFavorite(pokemon as unknown as Pokemon);
  };

  const handleAddToTeam = (teamId: string) => {
    addToTeam(teamId, pokemon as unknown as Pokemon);
    setShowTeamSelect(false);
  };


  return (
    <div className="pokemon-details-page">
      <div className="details-actions">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <div className="right-actions">
          <button 
            className={`action-btn ${isFavorite(pokemon.id) ? 'active' : ''}`}
            onClick={handleToggleFavorite}
          >
            <Heart size={24} fill={isFavorite(pokemon.id) ? "currentColor" : "none"} />
          </button>
          <button className="action-btn" onClick={() => setShowTeamSelect(!showTeamSelect)}>
            <Plus size={24} />
          </button>

          {showTeamSelect && (
            <div className="team-dropdown">
              <h4>Adicionar ao time:</h4>
              {teams.length === 0 ? (
                <p>Crie um time primeiro!</p>
              ) : (
                teams.map(t => (
                  <button key={t.id} onClick={() => handleAddToTeam(t.id)}>
                    {t.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="pokemon-header">
        <div className="header-content">
          <div className="header-info">
            <span className="detail-id">{formatPokemonId(pokemon.id)}</span>
            <h2 className="detail-name">{pokemon.name}</h2>
            <div className="detail-types">
              {pokemon.types.map((t: PokemonType) => (
                <span 
                  key={t.type.name} 
                  className="detail-type-badge"
                  style={{ backgroundColor: typeColors[t.type.name] }}
                >
                  {translateType[t.type.name]}
                </span>
              ))}
            </div>
          </div>
          <div className="detail-image">
            <img src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} />
          </div>
        </div>
      </div>

      <div className="details-content">
        <section className="info-section">
          <div className="section-header">
            <h3>Sobre</h3>
          </div>
          <div className="physical-traits">
            <div className="trait">
              <span className="trait-label">Altura</span>
              <span className="trait-value">{pokemon.height / 10} m</span>
            </div>
            <div className="trait">
              <span className="trait-label">Peso</span>
              <span className="trait-value">{pokemon.weight / 10} kg</span>
            </div>
            <div className="trait">
              <span className="trait-label">Habilidades</span>
              <div className="abilities">
                {pokemon.abilities.map((a: PokemonAbility) => (
                  <span key={a.ability.name} className="ability-tag">{translateAbility[a.ability.name]}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="section-header">
            <h3>Estatísticas</h3>
          </div>
          <PokemonStats stats={pokemon.stats} color={typeColors[mainType]} />
        </section>

        <section className="evolution-section">
          <div className="section-header">
            <h3>Linha Evolutiva</h3>
          </div>
          <EvolutionChain chain={pokemon.evolutionChain} />
        </section>

        <section className="similar-section">
          <div className="section-header">
            <h3>Pokémons Semelhantes</h3>
          </div>
          <SimilarPokemons type={mainType} />
        </section>

        <p className="details-api-note">
          Todas as informações exibidas nesta página foram obtidas pela PokéAPI.
        </p>
      </div>
    </div>
  );
};
