export class Cliente {


    // Propiedades Obligatorias
    constructor(
        public idCliente: string,
        public nombre: string,
        public apellido: string,
        public idTipoDocumento: string,
        public numeroDocumento: string,
        public telefono: string
    ){}
}
