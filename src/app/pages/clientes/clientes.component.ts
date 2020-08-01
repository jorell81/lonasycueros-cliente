import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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

  @Input() public clienteVenta = false;
  @Input() public numeroCliente: string = '';
  @Output() public onSelect = new EventEmitter();
  flip: boolean = false;
  pagina = 1;
  itemsPagina = 10;
  cantBusqueda: number = 0;
  forma: FormGroup;
  clientes: Cliente[] = [];
  tipoDocumentos: TipoDocumento[] = [];
  mostrarSinResultado: boolean = false;

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
    if (this.clienteVenta) {
      this.agregarCliente();
    }
    this.cargarClientes();
    this.cargarTipoDocumentos();
  }

  get nombreNoValido() { return this.forma.get('nombre'); }
  get apellidoNoValido() { return this.forma.get('apellido'); }
  get tipoDocumentoNoValido() { return this.forma.get('idTipoDocumento'); }
  get numDocNoValido() { return this.forma.get('numeroDocumento'); }
  get telefonoNoValido() { return this.forma.get('telefono'); }

  crearFormulario(){
    this.forma = this.fb.group({
      idCliente: null,
      nombre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      apellido: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      idTipoDocumento: [null, Validators.required],
      numeroDocumento: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
      telefono: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
    });
  }

  resetFormulario(numeroDocumento = null){
    this.forma.reset({
      idCliente: null,
      nombre: null,
      apellido: null,
      idTipoDocumento: null,
      numeroDocumento: numeroDocumento,
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
    this.resetFormulario(this.numeroCliente);
  }

  guardarCliente(){
    let data = this.forma.value;
    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach(control => {
        control.markAsTouched();
      });
      return false;
    }
    this._clienteService[data.idCliente !== null ? 'actualizarCliente' : 'crearCliente'](data).subscribe((resp: any) => {
      this.cargarClientes();
      this.flip = !this.flip;
      if (this.clienteVenta) {
        data.idCliente = resp;
        this.onSelect.emit(data);
      }
      this.resetFormulario();
    });
  }
  
  buscar(termino: string){
    if (termino && termino.length > 2) {
      this._buscador.buscar('cliente', termino).subscribe( resp => {
        if (resp.cliente.length > 0) {
            this.clientes = resp.cliente;
            this.cantBusqueda = resp.cliente.length;
            this.mostrarSinResultado = false;
        } else {
          this.cantBusqueda = 0;
          this.mostrarSinResultado = true;
          this.clientes = [];
        }
      });
    } else if ( termino === '') {
      this.cantBusqueda = 0;
      this.mostrarSinResultado = false;
      this.cargarClientes();
    }
  }

  actualizarCliente( $this ){
    console.log($this);
    this.flip = !this.flip;
    this.forma.setValue({
      idCliente: $this.idCliente,
      nombre: $this.nombre,
      apellido: $this.apellido,
      idTipoDocumento: $this.idTipoDocumento,
      numeroDocumento: $this.numeroDocumento,
      telefono: $this.telefono
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
          if (this.clienteVenta) {
            return this.onSelect.emit(null);
          }
          this.flip = !this.flip;
        }
      });
    } else {
      if (this.clienteVenta) {
        return this.onSelect.emit(null);
      }
      this.flip = !this.flip;
    }
  }

  cargarTipoDocumentos(){
    this._tipoDocumentoService.consultarTipoDocumentos().subscribe( (tipoDocumento: any) => {
      this.tipoDocumentos = tipoDocumento;
    });
  }

  /* eliminarCliente($this){
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
        this._clienteService.eliminarCliente( $this.idCliente ).subscribe( resp => {
          this.cargarClientes();
        });
      }
    });
  } */

}
