
import { EstadoReserva } from "../constants/EstadoReserva"
import { HabitacionData } from "./habitacionData"
import { HuespedData } from "./huespedData"

export interface ReservacionRequest {
    idHuesped: number,
    idHabitacion: number,
    fechaInicio: Date,
    fechaFin: Date,
    idEstadoReserva: number
}

export interface ReservacionResponse {
    id: number,
    huespedData: HuespedData,
    habitacionData: HabitacionData
    nacionalidad: string,
    fechaReserva: Date,
    fechaInicio: Date,
    fechaFin: Date,
    estadoReserva: EstadoReserva
}