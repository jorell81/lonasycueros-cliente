import { Component, OnInit, Inject } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { Globales } from '../../config/globales';
import { CategoriaService } from '../../services/service.index';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BuscadorService } from '../../services/buscador/buscador.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styles: []
})
export class CategoriasComponent implements OnInit {

  pagina      = 1;
  itemsPagina = 10;
  categorias: Categoria[] = [];
  TituloModal: string;
  forma: FormGroup;
  cantBusqueda: number = 0;
  botonOculto: boolean = true; // mantiene oculto el boton de cerrar el modal
  mostrarEstado: boolean = false;
  

  constructor(
    @Inject(DOCUMENT) private _document,
    config: NgbModalConfig,
    public globales: Globales,
    public _categoriaService: CategoriaService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public _buscador: BuscadorService

  ) { 
    this.crearFormulario();
    this.resetFormulario();
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.cargarCategorias();
  }

  get nombreNoValido() { return this.forma.get('nombre'); }
  get descripcionNoValido() { return this.forma.get('descripcion'); }

  crearFormulario() {
    this.forma = this.fb.group({
      idCategoria: null,
      nombre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      descripcion: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      estado: false
    });
  }

  cargarCategorias(){
    this._categoriaService.cargarCategorias().subscribe( (categorias: any) => {
      this.categorias = categorias;
    });
  }

  agregarCategoria(content){
    this.TituloModal = 'Agregar Categoría';
    this.resetFormulario();
    this.open(content);
    this.mostrarEstado = false;
  }

  open(content) {
    this.modalService.open(content);
  }

  crearCategoria(){
    let data = this.forma.value;
    if ( this.forma.invalid) {
      Object.values( this.forma.controls).forEach( control => {
        control.markAsTouched();
      });
      return false;
    }
    this._categoriaService[data.idCategoria !== null ? 'actualizarCategoria' : 'crearCategoria' ](data).subscribe( (resp: any) => {
      this.cargarCategorias();
      document.getElementById('close').click();
      this.cantBusqueda = 0;
      this._document.getElementById('buscador').value = '';
    });
  }

  actualizarCategoria( $this ){
    this.mostrarEstado = true;
    this.TituloModal = 'Editar Categoría';
    this.forma.setValue({
      idCategoria: $this.idCategoria,
      nombre: $this.nombre,
      descripcion: $this.descripcion,
      estado: $this.estado
    });
  }

  eliminarCategoria( $this ){
    Swal.fire({
      title: 'Confirmación',
      text: 'Eliminara la categoría ' + $this.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this._categoriaService.eliminarCategoria( $this.idCategoria ).subscribe( resp => {
          this.cargarCategorias();
        });
      }
    });
  }

  resetFormulario(){
    this.forma.reset({
      _id: null,
      nombre: null,
      descripcion: null,
      estado: false
    });
  }

  cerrarModal(){
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
          document.getElementById('close').click();
        }
      });
    } else {
      document.getElementById('close').click();
    }
  }

  buscar( termino: string ){
    if (termino && termino.length > 2) {
      this._buscador.buscar('categoria', termino).subscribe( resp => {
        if (resp.categoria.length > 0) {
            this.categorias = resp.categoria;
            this.cantBusqueda = resp.categoria.length;
        } else {
          this.cargarCategorias();
          this.cantBusqueda = 0;
        }
      });
    } else {
      this.cantBusqueda = 0;
      this.cargarCategorias();
    }
  }
}
