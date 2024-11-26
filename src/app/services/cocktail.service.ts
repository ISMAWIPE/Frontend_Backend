import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Cocktail {
  id: string;
  name: string;
  image: string;
  description: string;
  race: string; // Categoría del cocktail
  ki: string;   // Contenido alcohólico
  glass: string;
  instructions: string;
  ingredients: string[];
  measures: string[];
}

export interface ApiResponse {
  drinks: any[];
}

@Injectable({
  providedIn: 'root'
})
export class CocktailService {
  private apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1';
  private allCocktails: Cocktail[] = [];

  constructor(private http: HttpClient) {}

  getCocktails(page: number = 1, itemsPerPage: number = 10, letter: string = 'a'): Observable<{ items: Cocktail[], total: number }> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/search.php?f=${letter}`).pipe(
      map(response => {
        const allItems = response.drinks ? this.transformCocktails(response.drinks) : [];
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = allItems.slice(startIndex, endIndex);
        
        return {
          items: paginatedItems,
          total: allItems.length
        };
      })
    );
  }

  searchCocktails(term: string, page: number = 1, itemsPerPage: number = 10): Observable<{ items: Cocktail[], total: number }> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/search.php?s=${term}`).pipe(
      map(response => {
        const allItems = response.drinks ? this.transformCocktails(response.drinks) : [];
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = allItems.slice(startIndex, endIndex);
        
        return {
          items: paginatedItems,
          total: allItems.length
        };
      })
    );
  }

  getCocktailById(id: string): Observable<Cocktail | null> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/lookup.php?i=${id}`).pipe(
      map(response => {
        if (response.drinks && response.drinks.length > 0) {
          return this.transformCocktailData(response.drinks[0]);
        }
        return null;
      })
    );
  }

  getRandomCocktail(): Observable<Cocktail> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/random.php`).pipe(
      map(response => this.transformCocktailData(response.drinks[0]))
    );
  }

  private transformCocktails(drinks: any[]): Cocktail[] {
    return drinks.map(drink => this.transformCocktailData(drink));
  }

  private transformCocktailData(drink: any): Cocktail {
    const ingredients: string[] = [];
    const measures: string[] = [];

    // Extraer ingredientes y medidas
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(ingredient);
        measures.push(measure || '');
      }
    }

    return {
      id: drink.idDrink,
      name: drink.strDrink,
      image: drink.strDrinkThumb,
      description: drink.strInstructions,
      race: drink.strCategory,
      ki: drink.strAlcoholic,
      glass: drink.strGlass,
      instructions: drink.strInstructions,
      ingredients,
      measures
    };
  }
}
