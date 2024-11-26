import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbzService, Character, ApiResponse, CharacterFilter } from '../../services/dbz.service';
import { CardListComponent } from '../../card-list/card-list.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dbz',
  templateUrl: './dbz.component.html',
  styleUrls: ['./dbz.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardListComponent,
    PaginationComponent
  ]
})
export class DbzComponent implements OnInit, OnDestroy {
  characters: Character[] = [];
  currentPage = 1;
  totalPages = 1;
  selectedCharacter: Character | null = null;
  searchTerm = '';
  selectedRace = '';
  isLoading = false;
  noResults = false;
  availableRaces: string[];

  private subscription: Subscription = new Subscription();

  constructor(private dbzService: DbzService) {
    this.availableRaces = this.dbzService.availableRaces;
  }

  ngOnInit() {
    this.loadCharacters();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadCharacters() {
    this.isLoading = true;
    this.noResults = false;

    const filters: CharacterFilter = {
      page: this.currentPage,
      limit: 9
    };

    this.subscription.unsubscribe(); // Cancelar suscripciones previas
    this.subscription = new Subscription();

    this.subscription.add(
      this.dbzService.getCharacters(filters).subscribe({
        next: (response: ApiResponse) => {
          this.characters = response.items;
          this.totalPages = response.meta.totalPages;
          this.noResults = this.characters.length === 0;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.noResults = true;
        }
      })
    );
  }

  onPageChange(page: number) {
    if (this.currentPage !== page) {
      this.currentPage = page;
      this.performSearch();
    }
  }

  onSearch(): void {
    this.currentPage = 1; // Reiniciar a la primera página en nueva búsqueda
    this.performSearch();
  }

  private performSearch(): void {
    this.isLoading = true;
    this.noResults = false;

    const filters: CharacterFilter = {};

    if (this.searchTerm.trim()) {
      // Si es un número, buscar por ID
      if (!isNaN(Number(this.searchTerm))) {
        this.searchById(Number(this.searchTerm));
        return;
      }
      filters.name = this.searchTerm.trim();
    }

    if (this.selectedRace) {
      filters.race = this.selectedRace;
    }

    // Aplicar paginación
    filters.page = this.currentPage;
    filters.limit = 9;

    this.subscription.unsubscribe(); // Cancelar suscripción anterior
    this.subscription = new Subscription();

    this.subscription.add(
      this.dbzService.getCharacters(filters).subscribe({
        next: (response: ApiResponse) => {
          this.characters = response.items;
          this.totalPages = response.meta.totalPages;
          this.noResults = this.characters.length === 0;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.noResults = true;
        }
      })
    );
  }

  private searchById(id: number): void {
    this.isLoading = true;

    this.subscription.unsubscribe(); // Cancelar suscripciones previas
    this.subscription = new Subscription();

    this.subscription.add(
      this.dbzService.getCharacterById(id).subscribe({
        next: (character: Character) => {
          this.characters = [character];
          this.totalPages = 1;
          this.noResults = false;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.noResults = true;
        }
      })
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.selectedRace = '';
    this.currentPage = 1;
    this.loadCharacters();
  }

  onCharacterSelect(character: Character) {
    this.selectedCharacter = character;
  }
}
