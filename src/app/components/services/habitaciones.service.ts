import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HabitacionRequest, HabitacionResponse } from '../models/habitaciones.model';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {

  private listaHabitaciones: HabitacionResponse[] = []; 

  getHabitaciones(): Observable<HabitacionResponse[]> {
    return of(this.listaHabitaciones);
  }
  getHabitacionById(id: number): HabitacionResponse | undefined {
    return this.listaHabitaciones.find(h => h.id === id);
  }

 postHabitacion(data: HabitacionRequest): Observable<HabitacionResponse> {

  const nueva: HabitacionResponse = {
    id: new Date().getTime(),
    numeroHabitacion: data.numeroHabitacion,
    tipoHabitacion: data.idTipoHabitacion.toString(),
    precio: data.precio,
    capacidad: data.capacidad,
      estadoHabitacion: data.idEstadoHabitacion.toString()
    };

    this.listaHabitaciones.push(nueva);

    return of(nueva);
}

  putHabitacion(data: HabitacionRequest, id: number): Observable<HabitacionResponse> {

  const index = this.listaHabitaciones.findIndex(h => h.id === id);

  const actualizado: HabitacionResponse = {
    id: id,
    numeroHabitacion: data.numeroHabitacion,
    tipoHabitacion: data.idTipoHabitacion.toString(),
    precio: data.precio,
    capacidad: data.capacidad,
    estadoHabitacion: data.idEstadoHabitacion.toString()

  };

  if (index !== -1) {
    this.listaHabitaciones[index] = actualizado;
  }

  return of(actualizado);
  }

  deleteHabitacion(id: number): Observable<void> {

    this.listaHabitaciones =
      this.listaHabitaciones.filter(h => h.id !== id);

    return of();
  }
}