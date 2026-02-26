export enum TipoDocumento{
    INE = 1,
    PASAPORTE = 2,
    LICENCIA_CONDUCIR =  3,
    CEDULA_PROFESIONAL=4,
    CARTILLA_MILITAR = 5,
    INAPM =6

}
export const TipoDocumentoDescripcion ={
    [TipoDocumento.INE]: 'Credencial Electoral',
    [TipoDocumento.PASAPORTE]: 'Licencia de conducir',
    [TipoDocumento.LICENCIA_CONDUCIR]: 'Licencia de conducir',
    [TipoDocumento.CEDULA_PROFESIONAL]: 'Cédula Profesional',
    [TipoDocumento.CARTILLA_MILITAR]: 'Cartilla del Servicio Militar Nacional',
    [TipoDocumento.INAPM]: 'Credencial para personas adultas mayores'

}