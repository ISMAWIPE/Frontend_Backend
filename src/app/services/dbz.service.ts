import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Character {
  id: number;
  name: string;
  ki: string;
  maxKi: string;
  race: string;
  gender: string;
  description: string;
  image: string;
  affiliation: string;
  originPlanet: {
    id: number;
    name: string;
    isDestroyed: boolean;
    description: string;
    image: string;
  };
}

export interface ApiResponse {
  items: Character[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export type CharacterFilter = {
  name?: string;
  race?: string;
  gender?: 'Male' | 'Female' | 'Unknown';
  affiliation?: string;
  page?: number;
  limit?: number;
};

@Injectable({
  providedIn: 'root'
})
export class DbzService {
  private apiUrl = 'https://dragonball-api.com/api';

  // Lista de razas disponibles según la documentación
  readonly availableRaces = [
    'Human',
    'Saiyan',
    'Namekian',
    'Majin',
    'Frieza Race',
    'Android',
    'Jiren Race',
    'God',
    'Angel',
    'Evil',
    'Nucleico',
    'Nucleico benigno',
    'Unknown'
  ];

  constructor(private http: HttpClient) {}

  getCharacters(filters: CharacterFilter = {}): Observable<ApiResponse> {
    let params = new HttpParams();
    
    // Agregar filtros si existen
    if (filters.name) params = params.set('name', filters.name);
    if (filters.race) params = params.set('race', filters.race);
    if (filters.gender) params = params.set('gender', filters.gender);
    if (filters.affiliation) params = params.set('affiliation', filters.affiliation);
    
    // Solo agregar página y límite si no hay otros filtros (según documentación)
    if (!filters.name && !filters.race && !filters.gender && !filters.affiliation) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<any>(`${this.apiUrl}/characters`, { params })
      .pipe(
        map(response => {
          // Si la respuesta es un array (caso de filtros), convertirla al formato ApiResponse
          if (Array.isArray(response)) {
            return this.convertToApiResponse(response);
          }
          return response;
        }),
        catchError(this.handleError<ApiResponse>('getCharacters'))
      );
  }

  getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/characters/${id}`)
      .pipe(
        catchError(this.handleError<Character>('getCharacterById'))
      );
  }

  private convertToApiResponse(characters: Character[]): ApiResponse {
    return {
      items: characters,
      meta: {
        currentPage: 1,
        itemsPerPage: characters.length,
        totalItems: characters.length,
        totalPages: 1
      }
    };
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of({} as T);
    };
  }
}