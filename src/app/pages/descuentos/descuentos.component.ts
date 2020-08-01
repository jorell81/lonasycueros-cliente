import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Descuento } from 'src/app/models/descuento.model';
import { Globales } from '../../config/globales';
import { BuscadorService } from 'src/app/services/service.index';
import { ProductoService } from '../../services/producto/producto.service';
import { Producto } from 'src/app/models/producto.model';
import { DescuentoService } from '../../services/descuento/descuento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-descuentos',
  templateUrl: './descuentos.component.html',
  styles: []
})
export class DescuentosComponent implements OnInit {

  flip: boolean = false;
  pagina = 1;
  itemsPagina = 10;
  cantBusqueda: number = 0;
  forma: FormGroup;
  descuentos: Descuento[] = [];
  fechaActual = new Date();
  productos: Producto[] = [];
  tipoDescuento = [{id: 1, valor: 'TODOS LOS PRODUCTOS'}, {id: 2, valor: 'POR PRODUCTO'}];
  validarDescProducto: boolean = false;
  mostrarProductos: boolean = false;
  actualizar: boolean = false;
  mostrarSinResultado: boolean = false;

  constructor(
    public fb: FormBuilder,
    public globales: Globales,
    public _buscador: BuscadorService,
    private _descuentoService: DescuentoService,
    private _productoService: ProductoService
  ) {
    this.crearFormulario();
    this.resetFormulario();
  }

  ngOnInit() {
    this.cargarDescuentos();
    this.cargarProductos();
  }

  get nombreNoValido() { return this.forma.get('nombre'); }
  get fechaInicioNoValido() { return this.forma.get('fechaInicio'); }
  get fechaFinNoValido() { return this.forma.get('fechaFin'); }
  get vDescuentoNoValido() { return this.forma.get('valorDescuento'); }
  get tipoDescuentoNoValido() { return this.forma.get('tipoDescuento'); }
  get idProductoNoValido() { return this.forma.get('idProducto'); }
  

  crearFormulario() {
    this.forma = this.fb.group({
      idDescuento: null,
      nombre: [null, [Validators.required]],
      fechaInicio: [null, [Validators.required]],
      fechaFin: [null, [Validators.required]],
      valorDescuento: [null, [Validators.required]],
      idProducto: [null, [Validators.required]],
      tipoDescuento: [null, [Validators.required]],
    }, { validators: this.verificarfechas('fechaInicio', 'fechaFin')});
  }

  verificarfechas( fechaInicio: string, fechaFin: string){

    return ( group: FormGroup) => {

      let fechaInicial = group.controls[fechaInicio].value;
      let fechaFinal = group.controls[fechaFin].value;

      if (fechaInicial <= fechaFinal) {
        return null;
      }
      return {
        problemaFechas : true
      };
    };
  }

  resetFormulario() {
    this.forma.reset({
      idDescuento: null,
      nombre: null,
      fechaInicio: null,
      fechaFin: null,
      valorDescuento: null,
      idProducto: null,
      tipoDescuento: null
    });
    this.mostrarProductos = false;
  }

  cargarDescuentos() {
    this._descuentoService.cargarDescuentos().subscribe( descuentos => {
      console.log(descuentos);
      this.descuentos = descuentos;
    });
  }

  cargarProductos(){
    this._productoService.cargarProductos().subscribe( productos => {
      this.productos = productos;
    });
  }

  agregarDescuento() {
    this.flip = !this.flip;
    this.resetFormulario();
  }

  actualizarDescuento($this) {
    this.flip = !this.flip;
    this.mostrarProductos = true;
    this.actualizar = true;
    this.forma.setValue({
      idDescuento: $this.idDescuento,
      nombre: $this.nombre,
      fechaInicio: $this.fechaInicio,
      fechaFin: $this.fechaFin,
      valorDescuento: $this.valorDescuento,
      idProducto: $this.idProducto,
      tipoDescuento: 2
    });
  }

  guardarDescuento() {
    const data = this.forma.value;
    let validarDescProducto = true;
    let errores = false;
    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach((control, i) => {
        if(control.invalid){
        if (!this.mostrarProductos && Object.keys(this.forma.controls)[i] === 'idProducto') {
          validarDescProducto = false;
        } else {
          errores = true;
          control.markAsTouched();
        }
      }
      });
      if (validarDescProducto || errores) {
        console.log("error");
        return false;
      }
    }
    console.log(this.forma.value);
    if (data.idProducto !== null ) {
      this._descuentoService[data.idDescuento !== null ? 'actualizarDescuento' : 'crearDescuento'](data).subscribe((resp: any) => {
        this.cargarDescuentos();
        this.flip = !this.flip;
        this.resetFormulario();
      });
      
    } else {
      this._descuentoService.crearDescuentoTodos(data).subscribe( resp => {
        this.flip = !this.flip;
        this.resetFormulario();
      });
    }
  }

  regresar() {
    
    if (this.forma.dirty) {
      Swal.fire({
        title: 'Confirmación',
        text: '¿Esta seguro, puede perder información?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.value) {
          this.flip = false;
        }
      });
    } else {
      this.flip = false;
    }
  }

  buscar(termino: string) {
    
    if (termino && termino.length > 2) {
      this._buscador.buscar('descuento', termino).subscribe( resp => {
        if (resp.descuento.length > 0) {
            this.descuentos = resp.descuento;
            this.cantBusqueda = resp.descuento.length;
            this.mostrarSinResultado = false;
        } else {
          this.cantBusqueda = 0;
          this.mostrarSinResultado = true;
          this.descuentos = [];
        }
      });
    } else if ( termino === '') {
      this.cantBusqueda = 0;
      this.mostrarSinResultado = false;
      this.cargarDescuentos();
    }
  }

  CambioSelect(event) {
    if (event > 0) {
      if (!this.actualizar) {
        this.forma.controls.idProducto.reset(null);
      }
      
      if (event === 2) {
        this.mostrarProductos = true;
      } else {
        this.mostrarProductos = false;
      }
    }

  }

  formatDate(date) {
    let d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
    if (month.length < 2){
      month = '0' + month;
    }
    if (day.length < 2){
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }

}
