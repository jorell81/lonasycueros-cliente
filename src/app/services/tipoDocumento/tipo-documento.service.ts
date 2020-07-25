import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

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

  consultarTipoDocumentos(){
    const url = `${ this.base_url}/tipoDocumento`;
    return this.http.get( url, this.headers).pipe( map ( (resp: any) => {
      return resp.tipoDocumentos;
    }));
  }
}
