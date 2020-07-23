import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente.model';
import { Globales } from '../../config/globales';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoDocumento } from '../../models/tipoDocumento.model';
import { TipoDocumentoService, ClienteService, BuscadorService } from '../../services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styles: []
})
export class ClientesComponent implements OnInit {

  flip: boolean = false;
  pagina = 1;
  itemsPagina = 10;
  cantBusqueda: number = 0;
  forma: FormGroup;
  clientes: Cliente[] = [];
  tipoDocumentos: TipoDocumento[] = [];

  constructor(
    public globales: Globales,
    public fb: FormBuilder,
    public _tipoDocumentoService: TipoDocumentoService,
    public _clienteService: ClienteService,
    public _buscador: BuscadorService,
  ) { 
    this.crearFormulario();
    this.resetFormulario();
  }

  ngOnInit() {
    this.cargarClientes();
    this.cargarTipoDocumentos();
  }

  get nombreNoValido() { return this.forma.get('nombre'); }
  get apellidoNoValido() { return this.forma.get('apellido'); }
  get tipoDocumentoNoValido() { return this.forma.get('tipoDocumento'); }
  get numIdenNoValido() { return this.forma.get('numeroIdentificacion'); }
  get telefonoNoValido() { return this.forma.get('telefono'); }

  crearFormulario(){
    this.forma = this.fb.group({
      _id: null,
      nombre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      apellido: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      tipoDocumento: [null, Validators.required],
      numeroIdentificacion: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(12)]],
      telefono: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
    });
  }

  resetFormulario(){
    this.forma.reset({
      _id: null,
      nombre: null,
      apellido: null,
      tipoDocumento: null,
      numeroIdentificacion: null,
      telefono: null,
    });
  }

  cargarClientes(){
    this._clienteService.cargarClientes().subscribe( clientes => {
      this.clientes = clientes;
    });
  }    

  agregarCliente(){
    this.flip = !this.flip;
    this.resetFormulario();
  }

  guardarCliente(){
    let data = this.forma.value;
    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach(control => {
        control.markAsTouched();
      });
      return false;
    }
    this._clienteService[data._id !== null ? 'actualizarCliente' : 'crearCliente'](data).subscribe((resp: any) => {
      this.cargarClientes();
      this.flip = !this.flip;
      this.resetFormulario();
    });
  }
  
  buscar(termino: string){
    if (termino && termino.length > 2) {
      this._buscador.buscar('cliente', termino).subscribe( resp => {
        if (resp.cliente.length > 0) {
            this.clientes = resp.cliente;
            this.cantBusqueda = resp.cliente.length;
        } else {
          this.cantBusqueda = 0;
        }
      });
    } else {
      this.cantBusqueda = 0;
      this.cargarClientes();
    }
  }

  actualizarCliente( $this ){
    console.log($this);
    this.flip = !this.flip;
    this.forma.setValue({
      _id: $this._id,
      nombre: $this.nombre,
      apellido: $this.apellido,
      tipoDocumento: $this.tipoDocumento._id,
      numeroIdentificacion: $this.numeroIdentificacion,
      telefono: $this.telefono
    });
  }

  eliminarCliente($this){
    Swal.fire({
      title: 'Confirmación',
      text: 'Eliminara el cliente ' + $this.nombre + ' ' + $this.apellido,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this._clienteService.eliminarCliente( $this._id ).subscribe( resp => {
          this.cargarClientes();
        });
      }
    });
  }

  regresar(){
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
          this.flip = !this.flip;
        }
      });
    } else {
      this.flip = !this.flip;
    }
  }

  

  cargarTipoDocumentos(){
    this._tipoDocumentoService.consultarTipoDocumentos().subscribe( (tipoDocumento: any) => {
      this.tipoDocumentos = tipoDocumento;
    });
  }

}
