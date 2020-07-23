import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';
import { SubCategoria } from '../../models/subcategoria.model';
import { Categoria } from '../../models/categoria.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubCategoriaService {

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

  cargarSubCategorias(){
    const url = `${ this.base_url}/subcategorias/0`;
    return this.http.get( url, this.headers).pipe( map ( (resp: any) => {
      return resp.subcategorias;
    }));
  }

  cargarSubCategoriasActivas(){
    const url = `${ this.base_url}/subcategorias/1`;
    return this.http.get( url, this.headers).pipe( map ( (resp: any) => {
      return resp.categorias;
    }));
  }

  crearSubCategoria(subcategoria: SubCategoria){
    return this.http.post(`${ this.base_url }/subcategorias`, subcategoria, this.headers).pipe( map( resp => {
      console.log(resp);
      Swal.fire('Crear Sub Categoría', 'Sub categoría creada con exito', 'success');
    }), catchError( err => {
      Swal.fire('Error al crear Sub categoría', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  actualizarSubCategoria( subcategoria: SubCategoria ){
    return this.http.put(`${ this.base_url }/subcategorias/${subcategoria.idSubCategoria}`, subcategoria, this.headers ).pipe( map( (resp: any) => {
      Swal.fire('Actualizar Sub Categoría', subcategoria.nombre, 'success');
    }), catchError( err => {
      Swal.fire('Error al actualizar Sub Categoría', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  eliminarSubCategoria( idSubCategoria: string){
    return this.http.delete(`${ this.base_url }/subcategorias/${idSubCategoria}`, this.headers ).pipe( map( (resp: any) => {
      Swal.fire('Eliminar Sub Categoría', 'La Sub Categoría se elimino con exito', 'success');
    }), catchError( err => {
      Swal.fire('Error al eliminar Sub Categoría', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  cargarSubCategoriasxIdCategoria(id: string){
    const url = `${this.base_url}/subcategorias/${id}/1`;
    return this.http.get( url, this.headers).pipe( map ( (resp: any) => {
      return resp.subcategorias;
    }));
  }

  


}
