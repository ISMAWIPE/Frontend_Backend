import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

export interface Empleado {
  _id: string; // Cambia `id` a `_id` porque es lo que devuelve la API
  nombre: string;
  apellido: string;
  roll: string;
  edad: number;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class MiApiService {
  private baseUrl = 'http://localhost:3000/api/empleados';

  constructor(private http: HttpClient) {}

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<{ empleados: Empleado[] }>(this.baseUrl).pipe(
      map((response) => response.empleados), // Extrae el arreglo de la propiedad `empleados`
      catchError((error) => {
        console.error('Error al obtener los empleados:', error);
        return of([]); // Devuelve un arreglo vacío en caso de error
      })
    );
  }

  getEmpleadosByPartialName(nombre: string): Observable<Empleado[]> {
    return this.http
      .get<{ empleados: Empleado[] }>(this.baseUrl) // La respuesta contiene un campo "empleados"
      .pipe(
        map((response) =>
          response.empleados.filter(
            (empleado) =>
              empleado.nombre.toLowerCase().includes(nombre.toLowerCase()) // Coincidencia parcial, ignorando mayúsculas/minúsculas
          )
        ), // Filtra todos los empleados que incluyen el nombre
        catchError((error) => {
          console.error(
            'Error al obtener los empleados por nombre parcial:',
            error
          );
          return of([]); // Devuelve un arreglo vacío en caso de error
        })
      );
  }

  getEmpleadoById(id: string): Observable<Empleado | undefined> {
    return this.http
      .get<{ empleados: Empleado[] }>(this.baseUrl) // La respuesta tiene un campo "empleados"
      .pipe(
        map((response) =>
          response.empleados.find((empleado) => empleado._id === id)
        ), // Filtra por ID
        catchError((error) => {
          console.error('Error al obtener el empleado por ID:', error);
          return of(undefined); // Devuelve `undefined` en caso de error
        })
      );
  }

  addEmpleado(empleado: Omit<Empleado, '_id'>): Observable<Empleado> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<Empleado>(this.baseUrl, empleado, { headers }).pipe(
      catchError((error) => {
        console.error('Error al agregar empleado:', error);
        throw error;
      })
    );
  }

  updateEmpleado(empleado: Empleado): Observable<Empleado> {
    if (!empleado._id) {
      throw Error('El ID del empleado es requerido para actualizar');
    }

    // Excluir `_id` del cuerpo de la solicitud
    const { _id, ...empleadoSinId } = empleado;

    return this.http.put<Empleado>(
      `${this.baseUrl}/${_id}`, // El ID va en la URL
      empleadoSinId // Solo los demás campos van en el cuerpo
    );
  }

  deleteEmpleadoById(id: string): Observable<boolean> {
    if (!id) {
      throw Error('El ID del empleado es requerido para eliminar');
    }

    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar empleado:', error);
        return of(false); // Devuelve `false` en caso de error
      }),
      map(() => true) // Devuelve `true` si la eliminación es exitosa
    );
  }
}
