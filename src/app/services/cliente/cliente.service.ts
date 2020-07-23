import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuario/usuario.service';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Cliente } from '../../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarClientes(){
    let url = URL_SERVICIOS + '/cliente';
    url += '?token=' + this._usuarioService.token;

    return this.http.get( url ).pipe( map( (resp: any) => {
      return resp.clientes;
    }), catchError(err => {
      Swal.fire('Error al consultar clientes', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  crearCliente(cliente: Cliente){
    let url = URL_SERVICIOS + '/cliente';
    url += '?token=' + this._usuarioService.token;

    return this.http.post( url, cliente).pipe( map( (resp: any) => {
      Swal.fire('Cliente creado', resp.cliente.nombre + ' ' + resp.cliente.apellido , 'success');
      return resp.cliente;
    }), catchError(err => {
      Swal.fire('Error al crear cliente', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  actualizarCliente( cliente: Cliente ){
    let url = URL_SERVICIOS + '/cliente/' + cliente._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, cliente).pipe( map( (resp: any) => {
      Swal.fire('Cliente actualizado', cliente.nombre + ' ' + cliente.apellido , 'success');
      return resp.cliente;
    }), catchError(err => {
      Swal.fire('Error al actualizar cliente', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  eliminarCliente(id){
    let url = URL_SERVICIOS + '/cliente/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete( url ).pipe( map( (resp: any) => {
      Swal.fire('Cliente Eliminado', resp.cliente.nombre + ' ' + resp.cliente.apellido, 'success');
      return resp.cliente;
    }), catchError(err => {
      Swal.fire('Error al eliminar cliente', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }
}
