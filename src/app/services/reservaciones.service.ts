import { Injectable } from "@angular/core";
import { ReservacionRequest, ReservacionResponse } from "../models/reservaciones.model";
import { catchError, map, Observable, of } from "rxjs";
import { EstadoReserva } from "../constants/EstadoReserva";
import { HttpClient } from "@angular/common/http";
import { environment } from "../enviroment/enviroment";
import { UsuarioRequest } from "../models/Usuarios.model";

@Injectable({
    providedIn: 'root'
})
export class ReservacionesService {

    private apiUrl: string = environment.apiUrl.concat("reservaciones");

    constructor(private http: HttpClient) { }

    getReservaciones(): Observable<ReservacionResponse[]> {
        return this.http.get<ReservacionResponse[]>((this.apiUrl)).pipe(
            map(reservaciones => reservaciones.sort((a, b) => a.id - b.id)),
            catchError(error => {
                console.error("Error al obtener los pacientes", error);
                return of([]);
            })
        )
    };

    postReservaciones(reservacionRequest: ReservacionRequest): Observable<ReservacionResponse> {
        return this.http.post<ReservacionResponse>((this.apiUrl), reservacionRequest).pipe(
            catchError(error => {
                console.error("Error al registrar una nueva reservacion", error)
                throw error
            })
        )
    };
}