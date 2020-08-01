import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';
import { Producto } from '../../models/producto.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

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

  cargarProductos(){
    const url = `${ this.base_url}/productos/0`;
    return this.http.get( url, this.headers).pipe( map ( (resp: any) => {
      return resp.productos;
    }));
  }

  consultarProductoxCodigoBarras(codigoBarras: string){
    const url = `${ this.base_url}/productos/codigo/${codigoBarras}`;
    return this.http.get( url, this.headers).pipe( map ( (resp: any) => {
      return resp.producto;
    }));
  }

  crearProducto(producto: Producto){
    return this.http.post(`${ this.base_url }/productos`, producto, this.headers).pipe( map( resp => {
      console.log(resp);
      Swal.fire('Crear Producto', 'Producto creado con exito', 'success');
    }), catchError( err => {
      Swal.fire('Error al crear Producto', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  actualizarProducto(producto: Producto){
    return this.http.put(`${ this.base_url }/productos/${producto.idProducto}`, producto, this.headers ).pipe( map( (resp: any) => {
      Swal.fire('Actualizar Producto', producto.nombre, 'success');
    }), catchError( err => {
      Swal.fire('Error al actualizar Producto', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  eliminarProducto(idProducto){
    return this.http.delete(`${ this.base_url }/productos/${idProducto}`, this.headers ).pipe( map( (resp: any) => {
      Swal.fire('Eliminar Producto', 'El Producto se elimino con exito', 'success');
    }), catchError( err => {
      Swal.fire('Error al eliminar Producto', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }
}
