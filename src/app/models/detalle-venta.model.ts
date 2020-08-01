export class DetalleVenta {
    constructor(
        public idProducto: number,
        public cantidad: number,
        public descuento: number,
        public iva: number,
        public valorSubTotal: number,
        public CodigoBarras: number,
        public nombreProducto: string,
        public MaxCantidad?: number,
        public idDetalleVenta?: number,
        public idVenta?: number,
        
    ) {}
    
};