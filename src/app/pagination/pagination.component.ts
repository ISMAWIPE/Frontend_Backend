import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  // Número de páginas a mostrar a cada lado de la página actual
  private pagesPerSide = 1;

  getPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    
    if (this.totalPages <= 5) {
      // Si hay 5 páginas o menos, mostrar todas
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    // Siempre mostrar la primera página
    pages.push(1);

    // Calcular el rango de páginas alrededor de la página actual
    let startPage = Math.max(2, this.currentPage - this.pagesPerSide);
    let endPage = Math.min(this.totalPages - 1, this.currentPage + this.pagesPerSide);

    // Ajustar si estamos cerca del inicio
    if (this.currentPage <= this.pagesPerSide + 2) {
      endPage = 4;
    }

    // Ajustar si estamos cerca del final
    if (this.currentPage >= this.totalPages - (this.pagesPerSide + 1)) {
      startPage = this.totalPages - 3;
    }

    // Agregar ellipsis después de la primera página si es necesario
    if (startPage > 2) {
      pages.push('...');
    }

    // Agregar páginas del rango calculado
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Agregar ellipsis antes de la última página si es necesario
    if (endPage < this.totalPages - 1) {
      pages.push('...');
    }

    // Siempre mostrar la última página
    if (this.totalPages > 1) {
      pages.push(this.totalPages);
    }

    return pages;
  }

  onPageChange(page: number | string): void {
    if (typeof page === 'number' && page !== this.currentPage && page > 0 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onPrevious(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  onNext(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}