import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';
import { SubCategoria } from '../../models/subcategoria.model';
import { Categoria } from '../../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class SubCategoriaService {

  
  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { 
  }

  cargarSubCategorias(){
    let url = URL_SERVICIOS + '/subcategoria';

    return this.http.get(url);
  }

  crearSubCategoria(subcategoria: SubCategoria){
    let url = URL_SERVICIOS + '/subcategoria';
    url += '?token=' + this._usuarioService.token;

    return this.http.post( url, subcategoria).pipe( map( (resp: any) => {
      Swal.fire('Sub Categoría creada', subcategoria.nombre, 'success');
      return resp.subcategoria;
    }), catchError( err => {
      Swal.fire('Error al crear sub categoría', err.error.mensaje, 'error');
      return throwError(err);
    }) );
  }

  actualizarSubCategoria( subcategoria: SubCategoria ){
    console.log(subcategoria);
    let url = URL_SERVICIOS + '/subcategoria/' + subcategoria._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, subcategoria).pipe( map( (resp: any) => {
      Swal.fire('Categoría actualizada', subcategoria.nombre, 'success');
      return resp.subcategoria;
    }), catchError( err =>{
      Swal.fire('Error al actualizar sub categoría', err.error.mensaje, 'error');
      return throwError(err);
    }) );
  }

  eliminarSubCategoria( id: string){
    let url = URL_SERVICIOS + '/subcategoria/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete( url ).pipe( map( (resp: any) => {
      Swal.fire('Sub Categoría Eliminada', resp.nombre, 'success');
    }), catchError( err => {
      Swal.fire('Error al eliminar sub categoría', err.error.mensaje, 'error');
      return throwError(err);
    }) );
  }

  cargarSubCategoriasxIdCategoria(id: string){
    let url = URL_SERVICIOS + '/subcategoria/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.get( url ).pipe( map( (resp: any) => {
      return resp.subcategorias;
    }));
  }

  


}
