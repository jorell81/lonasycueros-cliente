export class SubCategoria {


    // Propiedades Obligatorias
    constructor(
        public idSubCategoria: string,
        public nombre: string,
        public descripcion: string,
        public idCategoria: string,
        public estado: boolean
    ){}
}
