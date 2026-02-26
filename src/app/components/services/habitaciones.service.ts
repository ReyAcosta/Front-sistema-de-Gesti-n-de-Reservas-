import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HabitacionRequest, HabitacionResponse } from '../models/habitaciones.model';
import { environment } from '../../enviroment/enviroment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {
   private apiUrl: string = environment.apiUrl.concat('habitaciones'); 

   constructor(private http: HttpClient){} 

 
  getHabitaciones(): Observable<HabitacionResponse[]> {
    return this.http.get<HabitacionResponse[]>(this.apiUrl).pipe(
        map(habitaciones => habitaciones.sort()),
          catchError(error => {
            console.error('Error al obtener las Habitaciones: ',error);
            return of([]);
          })
         );
  }
 

 postHabitacion(habitacion: HabitacionRequest): Observable<HabitacionResponse> {

  return this.http.post<HabitacionResponse>(this.apiUrl, habitacion).pipe(
        catchError(error => {
          console.error('Error al registrar una habitacion', error);
          throw error;
        })
      );
}

  putHabitacion(habitacion: HabitacionRequest, habitacionId: number): Observable<HabitacionResponse> {
    return this.http.put<HabitacionResponse>(`${this.apiUrl}/${habitacionId}`, habitacion).pipe(
          catchError(error => {
            console.error('Error al actualizar una Habitacion', error);
            throw error;
    
          })
        );
      }
  
 

  deleteHabitacion(habitacionId: number): Observable<void> {

   return this.http.delete<void>(`${this.apiUrl}/${habitacionId}`).pipe(
      catchError(error => {
        console.error('Error al eliminar una habitacion', error);
        throw error;
      })
    );
  }
}