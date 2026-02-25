export enum EstadoReserva {
    CONFIRMADA = 1,
    EN_CURSO =2,
    CANCELADA = 3,
    FINALIZADA = 4
}

export const EstadoReservaDescriptions = {
    [EstadoReserva.CONFIRMADA]: 'Reserva Creada',
    [EstadoReserva.EN_CURSO]: 'Check-in realizado',
    [EstadoReserva.FINALIZADA]: 'Check-out realizado',
    [EstadoReserva.CANCELADA]: 'Reserva cancelada',

};