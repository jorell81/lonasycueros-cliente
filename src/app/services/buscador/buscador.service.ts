import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class BuscadorService {

  base_url = environment.base_url;
  token: string;
  headers = {};

  constructor(
    public http: HttpClient,
    private _usuarioService: UsuarioService
  ) { 
    this.token = _usuarioService.token;
    this.headers = _usuarioService.headers;
  }  

  buscar( coleccion: string, termino: string ){
    const url = `${ this.base_url}/busqueda/${ coleccion }/` + termino;
    return this.http.get( url, this.headers).pipe( map ( (resp: any) => {
      return resp;
    }));
  }
}
