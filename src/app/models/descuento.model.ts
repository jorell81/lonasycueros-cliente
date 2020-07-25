export class Descuento {


    // Propiedades Obligatorias
    constructor(
        public idDescuento: string,
        public nombre: string,
        public fechaInicio: string,
        public fechaFin: string,
        public valorDescuento: number,
        public idProducto: number
    ){}
}
