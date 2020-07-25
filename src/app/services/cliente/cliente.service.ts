import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuario/usuario.service';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Cliente } from '../../models/cliente.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  base_url = environment.base_url;
  token: string;
  headers = {};

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) {
    this.token = _usuarioService.token;
    this.headers = _usuarioService.headers;
   }

  cargarClientes(){
    const url = `${ this.base_url}/clientes`;
    return this.http.get( url, this.headers).pipe( map ( (resp: any) => {
      return resp.clientes;
    }));
  }

  crearCliente(cliente: Cliente){
    return this.http.post(`${ this.base_url }/clientes`, cliente, this.headers).pipe( map( resp => {
      console.log(resp);
      Swal.fire('Crear Cliente', 'Cliente creado con exito', 'success');
    }), catchError( err => {
      Swal.fire('Error al crear Cliente', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  actualizarCliente( cliente: Cliente ){
    return this.http.put(`${ this.base_url }/clientes/${cliente.idCliente}`, cliente, this.headers ).pipe( map( (resp: any) => {
      Swal.fire('Actualizar Cliente', cliente.nombre + ' ' + cliente.apellido, 'success');
    }), catchError( err => {
      Swal.fire('Error al actualizar Cliente', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  /* eliminarCliente(id){
    let url = URL_SERVICIOS + '/cliente/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete( url ).pipe( map( (resp: any) => {
      Swal.fire('Cliente Eliminado', resp.cliente.nombre + ' ' + resp.cliente.apellido, 'success');
      return resp.cliente;
    }), catchError(err => {
      Swal.fire('Error al eliminar cliente', err.error.mensaje, 'error');
      return throwError(err);
    }));
  } */
}
