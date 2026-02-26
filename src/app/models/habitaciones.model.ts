export interface HabitacionRequest{
    numeroHabitacion: number,
    idTipoHabitacion: number,
    precio: number,
    capacidad: number,
    idEstadoHabitacion: number
}

export interface HabitacionResponse{
    id: number,
    numeroHabitacion: number,
	tipoHabitacion: string,
	precio: number,
	capacidad: number,
	estadoHabitacion: string
}