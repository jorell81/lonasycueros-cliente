export class Producto {


    // Propiedades Obligatorias
    constructor(
        public _id: string,
        public nombre: string,
        public idSubCategoria: string,
        public codigoBarras: string,
        public valorEntrada: number,
        public valorSalida: number,
        public bodega: number,
        public talla: string,
        public color: string,
        public marca: string,
        public genero: string,
        public fechaRegistro: string,
    ){}
}