export class Usuario {


    // Propiedades Obligatorias
    constructor(
        public nombre: string,
        public apellido: string,
        public email: string,
        public password: string,
        public role?: string,
        public _id?: string
    ){}
}