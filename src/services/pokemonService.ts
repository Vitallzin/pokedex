import axios from 'axios';
import type { Pokemon, EvolutionNode, PokemonDetail, PokemonSpecies } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';
const NATIONAL_POKEDEX_MAX_ID = 1025;

interface PokemonListResponse {
  results: { name: string; url: string }[];
  count: number;
}

export const pokemonService = {
  async getPokemonList(limit = 20, offset = 0) {
    const response = await axios.get<PokemonListResponse>(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    const results = await Promise.all(
      response.data.results.map(async (p: { url: string }) => {
        const detail = await axios.get<Pokemon>(p.url);
        return detail.data;
      })
    );
    return {
      count: response.data.count,
      results
    };
  },

  async getPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
    const response = await axios.get<Pokemon>(`${BASE_URL}/pokemon/${nameOrId}`);
    const species = await axios.get<PokemonSpecies>(response.data.species.url);
    
    // Fetch evolution chain
    const evolutionChain = await axios.get<{ chain: EvolutionNode }>(species.data.evolution_chain.url);

    return {
      ...response.data,
      species: species.data,
      evolutionChain: evolutionChain.data.chain
    };
  },

  async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    const response = await axios.get<Pokemon>(`${BASE_URL}/pokemon/${nameOrId}`);
    return response.data;
  },

  async getAllPokemons() {
    const response = await axios.get(`${BASE_URL}/pokemon?limit=2000`);
    return response.data.results
      .map((p: { name: string; url: string }) => {
        const id = parseInt(p.url.split('/').filter(Boolean).pop() || '0');
        return { name: p.name, id };
      })
      .filter((pokemon: { id: number }) => pokemon.id >= 1 && pokemon.id <= NATIONAL_POKEDEX_MAX_ID);
  },

  async getPokemonsByType(type: string) {
    const response = await axios.get(`${BASE_URL}/type/${type}`);
    const pokemonLinks = response.data.pokemon.slice(0, 10); // Limit to 10 similar
    const results = await Promise.all(
      pokemonLinks.map(async (p: { pokemon: { url: string } }) => {
        const detail = await axios.get<Pokemon>(p.pokemon.url);
        return detail.data;
      })
    );
    return results;
  },

  async getPokemonIdsByType(type: string): Promise<number[]> {
    const response = await axios.get(`${BASE_URL}/type/${type}`);
    return response.data.pokemon
      .map((p: { pokemon: { url: string } }) => Number(p.pokemon.url.split('/').filter(Boolean).pop()))
      .filter((id: number) => Number.isFinite(id));
  }
};
