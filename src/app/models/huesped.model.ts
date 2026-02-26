export interface HuespedRequest{
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    email: string,
    telefono: string,
    direccion: string,
    idDocumento: number, 
    idNacionalidad: number
}

export interface HuespedResponse{
    id: number, 
    nombre: string, 
    apellidoPaterno: string,
    apellidoMaterno: string,
	email: string,
	telefono: string,
	tipoDocumento:string,
	nacionalidad: string
}