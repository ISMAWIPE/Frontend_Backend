import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PokemonService, Pokemon } from '../../services/pokemon.service';
import { CardListComponent } from '../../card-list/card-list.component';
import { PaginationComponent } from '../../pagination/pagination.component';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardListComponent,
    PaginationComponent
  ]
})
export class PokemonComponent implements OnInit, OnDestroy {
  pokemons: Pokemon[] = [];
  currentPage = 1;
  itemsPerPage = 20;
  totalItems = 0;
  loading = false;
  error: string | null = null;
  selectedPokemon: Pokemon | null = null;
  searchTerm = '';
  private destroy$ = new Subject<void>();

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemons();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPokemons(): void {
    this.loading = true;
    this.error = null;
    
    this.pokemonService.getPokemons(this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.pokemons = data.items;
          this.totalItems = data.total;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading pokemon:', err);
          this.error = 'Error al cargar los Pokémon. Por favor, intenta de nuevo más tarde.';
          this.loading = false;
        }
      });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.loadPokemons();
      return;
    }

    this.loading = true;
    this.pokemonService.searchPokemon(this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.pokemons = data.items;
          this.totalItems = data.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error en la búsqueda:', error);
          this.error = 'No se encontró el Pokémon especificado.';
          this.loading = false;
        }
      });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadPokemons();
  }

  onPageChange(page: number): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentPage = page;
    this.loadPokemons();
  }

  onPokemonClick(pokemon: Pokemon): void {
    this.selectedPokemon = pokemon;
  }

  closeModal(): void {
    this.selectedPokemon = null;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}