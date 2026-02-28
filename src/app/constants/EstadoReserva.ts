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

export function obtenerIdPorDescripcion(descripcion: string): number {
    const entry = Object.entries(EstadoReservaDescripcion)
        .find(([id, desc]) => desc === descripcion);

    if (!entry) {
        throw new Error(`Descripción de estado inválida: ${descripcion}`);
    }

    return Number(entry[0]);
}