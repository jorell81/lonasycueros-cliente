import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuario/usuario.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  base_url = environment.base_url;
  token: string;
  headers = {};

  constructor(
    private _usuarioService: UsuarioService,
    private http: HttpClient
  ) {
    this.token = _usuarioService.token;
    this.headers = _usuarioService.headers;
   }

   crearVenta( venta: any ){
     console.log(venta);
     return this.http.post(`${ this.base_url }/ventas`, venta, this.headers).pipe( map( (resp: any) => {
      Swal.fire('Venta', 'Venta realizada con exito', 'success');
      return resp.venta;
    }), catchError( err => {
      Swal.fire('Error al crear venta', err.error.mensaje, 'error');
      return throwError(err);
    }));
   }
}
