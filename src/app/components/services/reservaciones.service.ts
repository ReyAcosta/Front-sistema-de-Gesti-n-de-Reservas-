import { Injectable } from "@angular/core";
import { ReservacionRequest, ReservacionResponse } from "../models/reservaciones.model";
import { Observable, of } from "rxjs";
import { HuespedesService } from "./huespedes.service";
import { HabitacionesService } from "./habitaciones.service";
import { EstadoReserva } from "../../constants/EstadoReserva";
import { DatePipe } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class ReservacionesService {

  private listaReservaciones: ReservacionResponse[] = [];

  constructor(
    private huespedService: HuespedesService,
    private habitacionService: HabitacionesService
  ) {}

  getReservaciones(): Observable<ReservacionResponse[]> {
    return of(this.listaReservaciones);
  }

  postReservacion(data: ReservacionRequest): Observable<ReservacionResponse> {

    const huesped = this.huespedService.getHuespedById(data.idHuesped);
    const habitacion = this.habitacionService.getHabitacionById(data.idHabitacion);

    if (!huesped || !habitacion) {
      throw new Error("Huésped o habitación no encontrados");
    }

    const nueva: ReservacionResponse = {
      id: new Date().getTime(),

      huespedData: {
        nombre: huesped.nombre,
        email: huesped.email,
        telefono: huesped.telefono,
        documento: huesped.tipoDocumento,
        nacionalidad: huesped.nacionalidad
      },

      habitacionData: {
        numeroHabitacion: habitacion.numeroHabitacion,
        tipoHabitacion: habitacion.tipoHabitacion,
        precio: habitacion.precio,
        capacidad: habitacion.capacidad,
        estadoHabitacion: habitacion.estadoHabitacion
      },

      nacionalidad: huesped.nacionalidad,
      fechaReserva: new Date(),
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
      estadoReserva: data.idEstadoReserva as EstadoReserva
    };

    this.listaReservaciones.push(nueva);

    return of(nueva);
  }

  putReservacion(data: ReservacionRequest, id: number): Observable<ReservacionResponse> {

    const index = this.listaReservaciones.findIndex(r => r.id === id);

    if (index === -1) {
      throw new Error("Reservación no encontrada");
    }

    const huesped = this.huespedService.getHuespedById(data.idHuesped);
    const habitacion = this.habitacionService.getHabitacionById(data.idHabitacion);

    if (!huesped || !habitacion) {
      throw new Error("Huésped o habitación no encontrados");
    }

    const actualizada: ReservacionResponse = {
      id: id,

      huespedData: {
        nombre: huesped.nombre,
        email: huesped.email,
        telefono: huesped.telefono,
        documento: huesped.tipoDocumento,
        nacionalidad: huesped.nacionalidad
      },

      habitacionData: {
        numeroHabitacion: habitacion.numeroHabitacion,
        tipoHabitacion: habitacion.tipoHabitacion,
        precio: habitacion.precio,
        capacidad: habitacion.capacidad,
        estadoHabitacion: habitacion.estadoHabitacion
      },

      nacionalidad: huesped.nacionalidad,
      fechaReserva: this.listaReservaciones[index].fechaReserva,
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
      estadoReserva: data.idEstadoReserva as EstadoReserva
    };

    this.listaReservaciones[index] = actualizada;

    return of(actualizada);
  }
  deleteReservacion(id: number): Observable<void> {
    this.listaReservaciones =
      this.listaReservaciones.filter(r => r.id !== id);
    return of();
  }
}