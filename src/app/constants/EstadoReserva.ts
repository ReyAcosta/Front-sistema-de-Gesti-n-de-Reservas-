export enum EstadoReserva {
    CONFIRMADA = 1,
    EN_CURSO = 2,
    CANCELADA = 3,
    FINALIZADA = 4
}
export const EstadoReservaDescripcion = {
    [EstadoReserva.CONFIRMADA]: 'Reserva creada',
    [EstadoReserva.EN_CURSO]: 'Check-in realizado',
    [EstadoReserva.FINALIZADA]: 'Check-out realizado',
    [EstadoReserva.CANCELADA]: 'Reserva cancelada',
}
