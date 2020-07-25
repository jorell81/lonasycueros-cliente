import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { UsuarioService } from '../usuario/usuario.service';
import { Descuento } from 'src/app/models/descuento.model';
@Injectable({
  providedIn: 'root'
})
export class DescuentoService {

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

  cargarDescuentos(){
    const url = `${ this.base_url}/descuentos`;
    return this.http.get( url, this.headers).pipe( map ( (resp: any) => {
      return resp.descuentos;
    }));
  }

  crearDescuento(descuento: Descuento){
    return this.http.post(`${ this.base_url }/descuentos`, descuento, this.headers).pipe( map( resp => {
      console.log(resp);
      Swal.fire('Crear Descuento', 'Descuento creado con exito', 'success');
    }), catchError( err => {
      Swal.fire('Error al crear Descuento', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  crearDescuentoTodos(descuento: Descuento){
    return this.http.post(`${ this.base_url }/descuentos/todos`, descuento, this.headers).pipe( map( resp => {
      console.log(resp);
      Swal.fire('Crear Descuento', 'Descuento creado con exito', 'success');
    }), catchError( err => {
      Swal.fire('Error al crear Descuento', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  actualizarDescuento(descuento: Descuento){
    return this.http.put(`${ this.base_url }/descuentos/${descuento.idDescuento}`, descuento, this.headers ).pipe( map( (resp: any) => {
      Swal.fire('Actualizar Descuento', descuento.nombre, 'success');
    }), catchError( err => {
      Swal.fire('Error al actualizar descuento', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }
}
