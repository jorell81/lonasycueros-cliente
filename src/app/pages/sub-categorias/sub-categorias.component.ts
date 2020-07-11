import { Component, OnInit } from '@angular/core';
import { SubCategoria } from '../../models/subcategoria.model';
import { Categoria } from '../../models/categoria.model';
import { Globales } from '../../config/globales';
import { CategoriaService, SubCategoriaService } from '../../services/service.index';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BuscadorService } from '../../services/buscador/buscador.service';

@Component({
  selector: 'app-sub-categorias',
  templateUrl: './sub-categorias.component.html',
  styles: []
})
export class SubCategoriasComponent implements OnInit {

  pagina      = 1;
  itemsPagina = 10;
  subcategorias: SubCategoria[] = [];
  categorias: Categoria[] = [];
  TituloModal: string;
  forma: FormGroup;
  cantBusqueda: number = 0;
  botonOculto: boolean = true;

  constructor(
    config: NgbModalConfig,
    public globales: Globales,
    public _categoriaService: CategoriaService,
    public _subCategoriaService: SubCategoriaService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public _buscador: BuscadorService,
  ) { 
    this.crearFormulario();
    this.resetFormulario();
    config.backdrop = 'static';
    config.keyboard = false;
  }


  ngOnInit() {
    this.cargarSubCategorias();
    this.cargarCategorias();
  }

  get nombreNoValido() { return this.forma.get('nombre').invalid && this.forma.get('nombre').touched; }
  get descripcionNoValido() { return this.forma.get('descripcion').invalid && this.forma.get('descripcion').touched; }
  get idCategoriaNoValido() { return this.forma.get('idCategoria').invalid && this.forma.get('idCategoria').touched; }

  crearFormulario() {
    this.forma = this.fb.group({
      _id: null,
      nombre: [null, [Validators.required, Validators.minLength(1)]],
      descripcion: [null, [Validators.required, Validators.minLength(1)]],
      idCategoria: [null, Validators.required]
    });
  }

  cargarSubCategorias(){
    this._subCategoriaService.cargarSubCategorias().subscribe( (resp: any) => {
      this.subcategorias = resp.subcategorias;
    });
  }

  cargarCategorias(){
    this._categoriaService.cargarCategorias().subscribe( (resp: any) => {
      this.categorias = resp.categorias;
    });
  }

  agregarSubCategoria(content){
    this.TituloModal = 'Agregar Sub Categoría';
    this.resetFormulario();
    this.open(content);
    
  }

  open(content) {
    this.modalService.open(content);
  }

  crearSubCategoria(){
    let data = this.forma.value;
    if ( this.forma.invalid) {
      Object.values( this.forma.controls).forEach( control => {
        control.markAsTouched();
      });
      return false;
    }
    this._subCategoriaService[data._id !== null ? 'actualizarSubCategoria' : 'crearSubCategoria' ](data).subscribe( (resp: any) => {
      this.cargarSubCategorias();
      document.getElementById('close').click();
    });
  }

  actualizarSubCategoria( $this ){
    this.TituloModal = 'Editar Sub Categoría';
    this.forma.setValue({
      _id: $this._id,
      nombre: ($this.nombre).trimRight().trimLeft(),
      descripcion: ($this.descripcion).trimRight().trimLeft(),
      idCategoria: $this.idCategoria._id
    });
  }

  eliminarSubCategoria( $this ){
    Swal.fire({
      title: 'Confirmación',
      text: 'Eliminara la sub categoria ' + $this.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this._subCategoriaService.eliminarSubCategoria( $this._id ).subscribe( resp => {
          this.cargarSubCategorias();
        });
      }
    });
  }

  resetFormulario(){
    this.forma.reset({
      _id: null,
      nombre: null,
      descripcion: null,
      idCategoria: ''
    });
  }

  cerrarModal(){
    console.log(this.forma.dirty);
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
      this._buscador.buscar('subcategoria', termino).subscribe( resp => {
        if (resp.subcategoria.length > 0) {
            this.subcategorias = resp.subcategoria;
            this.cantBusqueda = resp.subcategoria.length;
            console.log(this.subcategorias);
        } else {
          this.cantBusqueda = 0;
        }
      });
    } else {
      this.cantBusqueda = 0;
      this.cargarSubCategorias();
    }
  }

}
