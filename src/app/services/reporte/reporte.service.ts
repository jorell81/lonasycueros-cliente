import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

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

  consultarReportes(form){
    const url = `${ this.base_url}/reportes`;
    return this.http.post( url, form, this.headers).pipe( map ( (resp: any) => {
      return resp.reporte;
    }));
  }

  consultarInventario(){
    const url = `${ this.base_url}/reportes`;
    return this.http.get( url, this.headers).pipe( map ( (resp: any) => {
      return resp.inventario;
    }));
  }
}
