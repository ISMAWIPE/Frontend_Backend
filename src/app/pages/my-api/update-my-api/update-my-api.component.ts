import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MiApiService, Empleado } from '../../../services/miApi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-my-api',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-my-api.component.html',
  styleUrls: ['./update-my-api.component.css'],
})
export class UpdateMyApiComponent implements OnInit {
  public empleadoForm = new FormGroup({
    _id: new FormControl(''), // Incluimos el campo _id para usarlo en la actualización
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    roll: new FormControl(''),
    edad: new FormControl<number | null>(null),
    email: new FormControl(''),
  });

  constructor(
    private miApiService: MiApiService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtener el ID de la URL

    if (id) {
      this.miApiService.getEmpleadoById(id).subscribe((empleado) => {
        if (empleado) {
          console.log(empleado);
          this.empleadoForm.reset(empleado);
        } else {
          console.error('Empleado no encontrado.');
          this.router.navigate(['/miapi/list']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.empleadoForm.valid) {
      const empleadoActualizado = this.empleadoForm.value as Empleado;

      console.log(empleadoActualizado);

      this.miApiService.updateEmpleado(empleadoActualizado).subscribe({
        next: () => {
          console.log('Empleado actualizado con éxito');
          this.router.navigate(['/miapi/list']);
        },
        error: (err) => {
          console.error('Error al actualizar el empleado:', err);
        },
      });
    } else {
      console.error('Formulario inválido:', this.empleadoForm);
    }
  }
}
