import { Component, OnInit, Inject } from '@angular/core';
import { SubCategoria } from '../../models/subcategoria.model';
import { Categoria } from '../../models/categoria.model';
import { Globales } from '../../config/globales';
import { CategoriaService, SubCategoriaService } from '../../services/service.index';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BuscadorService } from '../../services/buscador/buscador.service';
import { DOCUMENT } from '@angular/common';

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
  mostrarEstado: boolean = false;
  mostrarSinResultado: boolean = false;

  constructor(
    @Inject(DOCUMENT) private _document,
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

  get nombreNoValido() { return this.forma.get('nombre'); }
  get descripcionNoValido() { return this.forma.get('descripcion'); }
  get idCategoriaNoValido() { return this.forma.get('idCategoria'); }

  crearFormulario() {
    this.forma = this.fb.group({
      idSubCategoria: null,
      nombre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      descripcion: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      idCategoria: [null, Validators.required],
      estado: false
    });
  }

  cargarSubCategorias(){
    this._subCategoriaService.cargarSubCategorias().subscribe( (subcategorias: any) => {
      this.subcategorias = subcategorias;
      console.log(subcategorias);
    });
  }

  cargarCategorias(){
    this._categoriaService.cargarCategoriasActivas().subscribe( (categorias: any) => {
      this.categorias = categorias;
    });
  }

  agregarSubCategoria(content){
    this.TituloModal = 'Agregar Sub Categoría';
    this.resetFormulario();
    this.open(content);
    this.mostrarEstado = false;
    
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
    this._subCategoriaService[data.idSubCategoria !== null ? 'actualizarSubCategoria' : 'crearSubCategoria' ](data).subscribe( (resp: any) => {
      this.cargarSubCategorias();
      document.getElementById('close').click();
    });
  }

  actualizarSubCategoria( $this ){
    this.TituloModal = 'Editar Sub Categoría';
    this.mostrarEstado = true;
    this.forma.setValue({
      idSubCategoria: $this.idSubCategoria,
      nombre: $this.nombre,
      descripcion: $this.descripcion,
      idCategoria: $this.idCategoria,
      estado: $this.estado
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
        this._subCategoriaService.eliminarSubCategoria( $this.idSubCategoria ).subscribe( resp => {
          this.cargarSubCategorias();
        });
      }
    });
  }

  resetFormulario(){
    this.forma.reset({
      idSubCategoria: null,
      nombre: null,
      descripcion: null,
      idCategoria: null,
      estado: false
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
            this.mostrarSinResultado = false;
        } else {
          this.cantBusqueda = 0;
          this.mostrarSinResultado = true;
          this.subcategorias = [];
        }
      });
    } else if ( termino === '') {
      this.cantBusqueda = 0;
      this.mostrarSinResultado = false;
      this.cargarSubCategorias();
    }
  }

}
