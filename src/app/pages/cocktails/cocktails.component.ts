import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { CocktailService, Cocktail } from '../../services/cocktail.service';
import { CardListComponent } from '../../card-list/card-list.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cocktails',
  templateUrl: './cocktails.component.html',
  styleUrls: ['./cocktails.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    CardListComponent,
    PaginationComponent,
    FormsModule
  ]
})
export class CocktailsComponent implements OnInit, OnDestroy {
  // Propiedades para la lista de cócteles
  cocktails: Cocktail[] = [];
  loading = false;
  error: string | null = null;

  // Propiedades para la paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // Propiedades para la búsqueda
  searchTerm = '';
  isSearching = false;
  currentLetter = 'a';

  // Propiedades para el modal
  selectedCocktail: Cocktail | null = null;

  // Subject para manejar la limpieza de subscripciones
  private destroy$ = new Subject<void>();

  constructor(private cocktailService: CocktailService) {}

  ngOnInit(): void {
    this.loadCocktails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCocktails(): void {
    this.loading = true;
    this.error = null;
    
    if (this.isSearching && this.searchTerm) {
      this.searchCocktails();
      return;
    }

    this.cocktailService.getCocktails(this.currentPage, this.itemsPerPage, this.currentLetter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.cocktails = data.items;
          this.totalItems = data.total;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading cocktails:', err);
          this.error = 'Error al cargar los cócteles. Por favor, intenta de nuevo más tarde.';
          this.loading = false;
        }
      });
  }

  searchCocktails(): void {
    if (!this.searchTerm.trim()) {
      this.clearSearch();
      return;
    }

    this.loading = true;
    this.error = null;
    this.isSearching = true;

    this.cocktailService.searchCocktails(this.searchTerm, this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.cocktails = data.items;
          this.totalItems = data.total;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error searching cocktails:', err);
          this.error = 'Error al buscar cócteles. Por favor, intenta de nuevo más tarde.';
          this.loading = false;
        }
      });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.isSearching = false;
    this.currentPage = 1;
    this.loadCocktails();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loadCocktails();
  }

  onCocktailClick(cocktail: Cocktail): void {
    this.selectedCocktail = cocktail;
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.selectedCocktail = null;
    document.body.classList.remove('modal-open');
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}