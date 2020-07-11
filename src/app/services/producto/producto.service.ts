import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';
import { Producto } from '../../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarProductos(){
    let url = URL_SERVICIOS + '/producto';

    return this.http.get(url);
  }

  crearProducto(producto: Producto){
    let url = URL_SERVICIOS + '/producto';
    url += '?token=' + this._usuarioService.token;
    
    return this.http.post( url ,producto ).pipe( map( (resp: any) => {
      Swal.fire('Producto creado', producto.nombre, 'success');
      return resp.subcategoria; 
    }), catchError(err =>{
      Swal.fire('Error al crear producto', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  actualizarProducto(producto: Producto){
    let url = URL_SERVICIOS + '/producto/' + producto._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, producto).pipe( map( (resp: any) => {
      Swal.fire('Producto actualizado', producto.nombre, 'success');
      return resp.producto;
    }), catchError( err =>{
      Swal.fire('Error al actualizar producto', err.error.mensaje, 'error');
      return throwError(err);
    }) );
  }

  eliminarProducto(id){
    let url = URL_SERVICIOS + '/producto/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete( url ).pipe( map( (resp: any) => {
      Swal.fire('Producto Eliminado', resp.nombre, 'success');
    }), catchError( err => {
      Swal.fire('Error al eliminar producto', err.error.mensaje, 'error');
      return throwError(err);
    }) );
  }
}
