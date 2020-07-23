export class Categoria {


    // Propiedades Obligatorias
    constructor(
        public idCategoria: string,
        public nombre: string,
        public descripcion: string,
        public estado: boolean
    ){}
}