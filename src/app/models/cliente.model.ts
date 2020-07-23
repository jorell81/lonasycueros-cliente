export class Cliente {


    // Propiedades Obligatorias
    constructor(
        public _id: string,
        public nombre: string,
        public apellido: string,
        public telefono: string,
        public tipoDocumento: string,
        public numeroIdentificacion: string
    ){}
}
