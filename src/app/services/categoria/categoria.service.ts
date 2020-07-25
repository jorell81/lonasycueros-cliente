import { Injectable } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

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

  cargarCategorias(){
    const url = `${ this.base_url}/categorias/0`;
    return this.http.get( url, this.headers).pipe( map ( (resp: any) => {
      return resp.categorias;
    }));
  }

  cargarCategoriasActivas(){
    const url = `${ this.base_url}/categorias/1`;
    return this.http.get( url, this.headers).pipe( map ( (resp: any) => {
      return resp.categorias;
    }));
  }

  crearCategoria(categoria: Categoria){

    return this.http.post(`${ this.base_url }/categorias`, categoria, this.headers).pipe( map( resp => {
      console.log(resp);
      Swal.fire('Crear Categoría', 'Categoría creada con exito', 'success');
    }), catchError( err => {
      Swal.fire('Error al crear categoría', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  actualizarCategoria( categoria: Categoria ){
    return this.http.put(`${ this.base_url }/categorias/${categoria.idCategoria}`, categoria, this.headers ).pipe( map( (resp: any) => {
      Swal.fire('Actualizar Categoría', categoria.nombre, 'success');
    }), catchError( err => {
      Swal.fire('Error al actualizar categoría', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  eliminarCategoria( idCategoria: number){
    return this.http.delete(`${ this.base_url }/categorias/${idCategoria}`, this.headers ).pipe( map( (resp: any) => {
      Swal.fire('Eliminar Categoría', 'La categoría se elimino con exito', 'success');
    }), catchError( err => {
      Swal.fire('Error al eliminar categoría', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  




}
