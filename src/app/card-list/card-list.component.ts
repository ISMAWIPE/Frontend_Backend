// src/app/components/card-list/card-list.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CardListComponent implements OnChanges {
  @Input() items: any[] = [];
  @Output() cardClick = new EventEmitter<any>();

  // Mapa para rastrear el estado de carga de cada imagen
  loadingStates: Map<string, boolean> = new Map();

  ngOnChanges(changes: SimpleChanges) {
    // Cuando los items cambian, inicializamos el estado de carga para cada imagen
    if (changes['items'] && changes['items'].currentValue) {
      this.items.forEach(item => {
        if (item.image && !this.loadingStates.has(item.image)) {
          this.loadingStates.set(item.image, true);
        }
      });
    }
  }

  truncateText(text: string, limit: number = 100): string {
    return text?.length > limit ? text.substring(0, limit) + '...' : text;
  }

  onCardClick(item: any) {
    this.cardClick.emit(item);
  }

  onImageError(event: any, imageUrl: string) {
    event.target.src = 'assets/placeholder.png';
    this.loadingStates.set(imageUrl, false);
  }

  onImageLoad(imageUrl: string) {
    this.loadingStates.set(imageUrl, false);
  }

  isLoading(imageUrl: string): boolean {
    return this.loadingStates.get(imageUrl) ?? true;
  }
}