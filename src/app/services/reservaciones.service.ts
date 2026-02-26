import { Injectable } from "@angular/core";
import { ReservacionRequest, ReservacionResponse } from "../models/reservaciones.model";
import { catchError, map, Observable, of } from "rxjs";
import { EstadoReserva } from "../constants/EstadoReserva";
import { HttpClient } from "@angular/common/http";
import { environment } from "../enviroment/enviroment";

@Injectable({
  providedIn: 'root'
})
export class ReservacionesService {
  private apiUrl: string = environment.apiUrl.concat('huespedes');

  constructor(private http: HttpClient){}
  

  getReservaciones(): Observable<ReservacionResponse[]> {
     return this.http.get<ReservacionResponse[]>(this.apiUrl).pipe(
        map(reservaciones => reservaciones.sort()),
          catchError(error => {
            console.error('Error al obtener reservaciones: ',error);
            return of([]);
          })
         );

  }

  postReservacion(reservacion: ReservacionRequest): Observable<ReservacionResponse> {
  return this.http.post<ReservacionResponse>(this.apiUrl, reservacion).pipe(
    catchError(error => {
      console.error('Error al registrar reservación:', error);
      throw error;
    })
  );
}
putReservacion(reservacion: ReservacionRequest, reservacionId: number): Observable<ReservacionResponse> {
  return this.http.put<ReservacionResponse>(`${this.apiUrl}/${reservacionId}`, reservacion).pipe(
    catchError(error => {
      console.error('Error al actualizar reservación:', error);
      throw error;
    })
  );
}
  deleteReservacion(reservacionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reservacionId}`).pipe(
          catchError(error => {
            console.error('Error al eliminar una reservacion', error);
            throw error;
          })
      );
  }
}