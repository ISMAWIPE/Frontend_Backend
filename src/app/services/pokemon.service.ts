import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, forkJoin, of, catchError } from 'rxjs';

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  description: string;
  race: string; // Tipo principal del Pokemon
  ki: number;   // Experiencia base
  //maxKi: string;
  //gender: string;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemons(page: number = 1, limit: number = 20): Observable<{ items: Pokemon[], total: number }> {
    const offset = (page - 1) * limit;
    
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`).pipe(
      switchMap(response => {
        const pokemonRequests = response.results.map(pokemon => 
          this.http.get(`${this.baseUrl}/pokemon/${pokemon.name}`)
        );
        
        return forkJoin(pokemonRequests).pipe(
          map(pokemonDetails => ({
            items: pokemonDetails.map(pokemon => this.transformPokemonData(pokemon)),
            total: response.count
          }))
        );
      })
    );
  }

  private transformPokemonData(pokemon: any): Pokemon {
    try {
      return {
        id: pokemon.id,
        name: this.capitalizeFirstLetter(pokemon.name),
        image: pokemon.sprites.other['official-artwork'].front_default || 
               pokemon.sprites.front_default,
        description: `${this.capitalizeFirstLetter(pokemon.name)} es un Pokémon de tipo ${
          pokemon.types.map((t: any) => this.capitalizeFirstLetter(t.type.name)).join('/')
        }`,
        race: this.capitalizeFirstLetter(pokemon.types[0].type.name),
        ki: pokemon.base_experience || pokemon.stats[0].base_stat || 100,
        //maxKi: pokemon.
        //gender: string;
      };
    } catch (error) {
      console.error('Error transforming pokemon data:', error);
      return {
        id: 0,
        name: 'Unknown',
        image: 'assets/placeholder.png',
        description: 'Información no disponible',
        race: 'Unknown',
        ki: 0
      };
    }
  }

  private capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  // Método adicional para obtener un Pokemon específico
  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get(`${this.baseUrl}/pokemon/${id}`).pipe(
      map(pokemon => this.transformPokemonData(pokemon))
    );
  }

  searchPokemon(query: string): Observable<{ items: Pokemon[], total: number }> {
    // Intenta buscar primero por ID si es un número
    const searchId = parseInt(query);
    if (!isNaN(searchId)) {
      return this.http.get(`${this.baseUrl}/pokemon/${searchId}`).pipe(
        map(pokemon => ({
          items: [this.transformPokemonData(pokemon)],
          total: 1
        })),
        catchError(() => of({ items: [], total: 0 }))
      );
    }

    // Si no es un ID, busca por nombre
    return this.http.get(`${this.baseUrl}/pokemon/${query.toLowerCase()}`).pipe(
      map(pokemon => ({
        items: [this.transformPokemonData(pokemon)],
        total: 1
      })),
      catchError(() => of({ items: [], total: 0 }))
    );
  }
}
