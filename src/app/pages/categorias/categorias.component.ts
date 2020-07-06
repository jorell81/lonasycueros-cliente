import { Component, OnInit } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { Globales } from '../../config/globales';
import { CategoriaService } from '../../services/service.index';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BuscadorService } from '../../services/buscador/buscador.service';

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

  constructor(
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

  get nombreNoValido() { return this.forma.get('nombre').invalid && this.forma.get('nombre').touched; }
  get descripcionNoValido() { return this.forma.get('descripcion').invalid && this.forma.get('descripcion').touched; }

  crearFormulario() {
    this.forma = this.fb.group({
      _id: null,
      nombre: [null, [Validators.required, Validators.minLength(1)]],
      descripcion: [null, [Validators.required, Validators.minLength(1)]]
    });
  }

  cargarCategorias(){
    this._categoriaService.cargarCategorias().subscribe( (resp: any) => {
      this.categorias = resp.categorias;
    });
  }

  agregarCategoria(content){
    this.TituloModal = 'Agregar Categoría';
    this.resetFormulario();
    this.open(content);
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
    this._categoriaService[data._id !== null ? 'actualizarCategoria' : 'crearCategoria' ](data).subscribe( (resp: any) => {
      this.cargarCategorias();
      document.getElementById('close').click();
    });
  }

  actualizarCategoria( $this ){
    this.TituloModal = 'Editar Categoría';
    this.forma.setValue({
      _id: $this._id,
      nombre: ($this.nombre).trimRight().trimLeft(),
      descripcion: ($this.descripcion).trimRight().trimLeft()
    });
  }

  eliminarCategoria( $this ){
    Swal.fire({
      title: 'Confirmación',
      text: 'Eliminara la categoria ' + $this.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this._categoriaService.eliminarCategoria( $this._id ).subscribe( resp => {
          this.cargarCategorias();
        });
      }
    });
  }

  resetFormulario(){
    this.forma.reset({
      _id: null,
      nombre: null,
      descripcion: null
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
    console.log(termino);
    if (termino) {
      this._buscador.buscar('categoria', termino).subscribe( resp => {
        if (resp.categoria.length > 0) {
            this.categorias = resp.categoria;
            this.cantBusqueda = resp.categoria.length;
        } else {
          this.cantBusqueda = 0;
        }
      });
    } else {
      this.cantBusqueda = 0;
      this.cargarCategorias();
    }
  }
}
