export enum EstadoHabitacion {
    DISPONIBLE = 1,
    OCUPADA = 2,
    LIMPIEZA = 3,
    MANTENIMIENTO = 4
}
export const EstadoHabitacionDescripcion = {
    [EstadoHabitacion.DISPONIBLE]: 'Lista para asignarse',
    [EstadoHabitacion.OCUPADA]: 'Asignada a una reserva',
    [EstadoHabitacion.MANTENIMIENTO]: 'En reparacion',
    [EstadoHabitacion.LIMPIEZA]: 'En limpieza'

};