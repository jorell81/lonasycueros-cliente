import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BuscadorService, ProductoService, CategoriaService, SubCategoriaService } from '../../services/service.index';
import { Globales } from '../../config/globales';
import { Categoria } from '../../models/categoria.model';
import { SubCategoria } from '../../models/subcategoria.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  flip: boolean = false;
  changeSelect: boolean = false;
  pagina = 1;
  itemsPagina = 10;
  productos: Producto[] = [];
  forma: FormGroup;
  cantBusqueda: number = 0;
  categorias: Categoria[] = [];
  subcategorias: SubCategoria[] = [];
  mostrarActivo: boolean = false;
  mostrarSinResultado: boolean = false;

  constructor(
    public globales: Globales,
    private fb: FormBuilder,
    public _buscador: BuscadorService,
    public _productoService: ProductoService,
    public _categoriaService: CategoriaService,
    public _subCategoriaService: SubCategoriaService
  ) {
    this.crearFormulario();
    this.resetFormulario();
  }

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();
  }

  get nombreNoValido() { return this.forma.get('nombre'); }
  get marcaNoValida() { return this.forma.get('marca'); }
  get valorEntradaNoValido() { return this.forma.get('valorEntrada'); }
  get valorSalidaNoValido() { return this.forma.get('valorSalida'); }
  get tallaNoValido() { return this.forma.get('talla'); }
  get colorNoValido() { return this.forma.get('color'); }
  get bodegaNoValido() { return this.forma.get('bodega'); }
  get generoNoValido() { return this.forma.get('genero'); }
  get idCategoriaNoValido() { return this.forma.get('idCategoria'); }
  get idSubCategoriaNoValido() { return this.forma.get('idSubCategoria'); }

  crearFormulario() {
    this.forma = this.fb.group({
      idProducto: null,
      nombre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      marca: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      valorEntrada: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      valorSalida: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      talla: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      color: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      bodega: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      genero: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      idCategoria: [null, [Validators.required, Validators.minLength(1)]],
      idSubCategoria: [null, [Validators.required, Validators.minLength(1)]],
      estado: false
    });
  }

  cargarProductos() {
    this._productoService.cargarProductos().subscribe( productos => {
      this.productos = productos;
    });
  }

  agregarProducto() {
    this.flip = !this.flip;
    this.mostrarActivo = false;
    this.resetFormulario();
  }

  guardarProducto() {
    let data = this.forma.value;
    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach(control => {
        control.markAsTouched();
      });
      return false;
    }
    this._productoService[data.idProducto !== null ? 'actualizarProducto' : 'crearProducto'](data).subscribe((resp: any) => {
      this.cargarProductos();
      this.flip = !this.flip;
      this.resetFormulario();
    });
  }

  cargarCategorias() {

    this._categoriaService.cargarCategorias().subscribe((categorias: any) => {
      this.categorias = categorias;
    });
  }

  CambioSelect(event) {
    if (event) {
      this.forma.controls.idSubCategoria.reset(null);
      this._subCategoriaService.cargarSubCategoriasxIdCategoria(event).subscribe((subcategorias) => {
        if (subcategorias.length > 0) {
          this.changeSelect = false;
        } else {
          this.changeSelect = true;
        }
        this.subcategorias = subcategorias;
      });
      
    }

  }

  actualizarProducto($this) { 
    this.flip = !this.flip;
    this.mostrarActivo = true;
    this.forma.setValue({
      idProducto: $this.idProducto,
      nombre: $this.nombre,
      marca: $this.marca,
      valorEntrada: $this.valorEntrada,
      valorSalida: $this.valorSalida,
      talla: $this.talla,
      color: $this.color,
      bodega: $this.bodega,
      genero: $this.genero,
      idCategoria: $this.idCategoria,
      idSubCategoria: $this.idSubCategoria,
      estado: $this.estado
    });
  }

  eliminarProducto($this) { 
    Swal.fire({
      title: 'Confirmación',
      text: 'Eliminara el producto ' + $this.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this._productoService.eliminarProducto( $this.idProducto ).subscribe( resp => {
          this.cargarProductos();
        });
      }
    });
  }

  buscar(termino: string) {
    if (termino && termino.length > 2) {
      this._buscador.buscar('producto', termino).subscribe( resp => {
        if (resp.producto.length > 0) {
            this.productos = resp.producto;
            this.cantBusqueda = resp.producto.length;
            this.mostrarSinResultado = false;
        } else {
          this.cantBusqueda = 0;
          this.mostrarSinResultado = true;
          this.productos = [];
        }
      });
    } else if ( termino === '') {
      this.cantBusqueda = 0;
      this.mostrarSinResultado = false;
      this.cargarProductos();
    }
  }

  resetFormulario() {
    this.forma.reset({
      _id: null,
      nombre: null,
      marca: null,
      valorEntrada: null,
      valorSalida: null,
      talla: null,
      color: null,
      bodega: null,
      genero: null,
      idCategoria: null,
      idSubCategoria: null,
      estado: false
    });
    this.subcategorias = [];
    this.changeSelect = false;
    this.mostrarActivo = false;
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

}
