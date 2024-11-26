import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MiApiService, Empleado } from '../../../services/miApi.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-my-api',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-my-api.component.html',
  styleUrls: ['./create-my-api.component.css'],
})
export class CreateMyApiComponent {
  public empleadoForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    roll: new FormControl(''),
    edad: new FormControl<number | null>(null),
    email: new FormControl(''),
  });

  constructor(private miApiService: MiApiService, public router: Router) {}

  onSubmit() {
    if (this.empleadoForm.valid) {
      const { _id, ...nuevoEmpleado } = this.empleadoForm.value as Empleado; // Excluir el campo _id
      console.log('Datos a enviar:', nuevoEmpleado);

      this.miApiService.addEmpleado(nuevoEmpleado).subscribe({
        next: () => {
          this.router.navigate(['/miapi/list']);
        },
        error: (err) => {
          console.error('Error al agregar empleado:', err);
        },
      });
    } else {
      console.error('Formulario inválido:', this.empleadoForm);
    }
  }
}
