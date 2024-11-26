import { Component } from '@angular/core';
import { Empleado, MiApiService } from '../../../services/miApi.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-my-api',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './list-my-api.component.html',
  styleUrl: './list-my-api.component.css',
})
export class ListMyApiComponent {
  public empleados: Empleado[] = []; // Lista de empleados completa
  public searchResults: Empleado[] = []; // Resultados de la búsqueda
  public searchTerm: string = ''; // Término de búsqueda

  constructor(private miApiService: MiApiService) {}

  ngOnInit(): void {
    // Cargar todos los empleados al iniciar
    this.miApiService.getEmpleados().subscribe((empleados) => {
      this.empleados = empleados;
      this.searchResults = empleados; // Inicializar la tabla con todos los empleados
    });
  }

  onSearch(): void {
    // Si el término de búsqueda está vacío, mostrar todos los empleados
    if (!this.searchTerm.trim()) {
      this.searchResults = this.empleados;
      return;
    }

    // Verificar si el término de búsqueda podría ser un ID
    if (this.isId(this.searchTerm)) {
      // Buscar por ID
      this.miApiService.getEmpleadoById(this.searchTerm).subscribe({
        next: (empleado) => {
          if (empleado) {
            this.searchResults = [empleado]; // Mostrar el único resultado encontrado por ID
          } else {
            this.searchResults = []; // No se encontró el empleado
            alert('No se encontró un empleado con ese ID.');
          }
        },
        error: (err) => {
          console.error('Error al buscar por ID:', err);
          alert('Hubo un error al buscar por ID.');
        },
      });
    } else {
      // Buscar por nombre (parcial)
      this.miApiService.getEmpleadosByPartialName(this.searchTerm).subscribe({
        next: (resultados) => {
          this.searchResults = resultados; // Actualizar los resultados mostrados en la tabla
          if (resultados.length === 0) {
            alert('No se encontraron empleados con ese nombre.');
          }
        },
        error: (err) => {
          console.error('Error al buscar empleados:', err);
          alert('Hubo un error al realizar la búsqueda por nombre.');
        },
      });
    }
  }

  // Método para verificar si el término es un ID
  isId(term: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(term); // Compara si el término tiene la longitud y formato de un ID de MongoDB
  }

  eliminarEmpleado(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      this.miApiService.deleteEmpleadoById(id).subscribe({
        next: (resultado) => {
          if (resultado) {
            alert('Empleado eliminado con éxito');
            // Actualizar la lista de resultados después de eliminar
            this.searchResults = this.searchResults.filter(
              (emp) => emp._id !== id
            );
            // Actualizar la lista completa en caso de nuevas búsquedas
            this.empleados = this.empleados.filter((emp) => emp._id !== id);
          } else {
            alert('Error al eliminar empleado');
          }
        },
        error: (err) => console.error('Error al eliminar empleado:', err),
      });
    }
  }
}
