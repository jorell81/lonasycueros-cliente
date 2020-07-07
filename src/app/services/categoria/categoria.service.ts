import { Injectable } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { 
  }

  cargarCategorias(){
    let url = URL_SERVICIOS + '/categoria';

    return this.http.get(url);
  }

  crearCategoria(categoria: Categoria){
    let url = URL_SERVICIOS + '/categoria';
    url += '?token=' + this._usuarioService.token;

    return this.http.post( url, categoria).pipe( map( (resp: any) => {
      Swal.fire('Categoría creada', 'categoria.nombre', 'success');
      return resp.categoria;
    }), catchError( err =>{
      Swal.fire('Error al crear categoría', err.error.mensaje, 'error');
      return throwError(err);
    }) );
  }

  actualizarCategoria( categoria: Categoria ){
    let url = URL_SERVICIOS + '/categoria/' + categoria._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, categoria).pipe( map( (resp: any) => {
      Swal.fire('Categoría actualizada', categoria.nombre, 'success');
      return resp.categoria;
    }), catchError( err =>{
      Swal.fire('Error al actualizar categoría', err.error.mensaje, 'error');
      return throwError(err);
    }) );
  }

  eliminarCategoria( id: string){
    let url = URL_SERVICIOS + '/categoria/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete( url ).pipe( map( (resp: any) => {
      Swal.fire('Categoría Eliminada', resp.nombre, 'success');
    }), catchError( err => {
      Swal.fire('Error al eliminar categoría', err.error.mensaje, 'error');
      return throwError(err);
    }) );
  }

  




}
