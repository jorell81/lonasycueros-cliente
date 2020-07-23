import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  consultarTipoDocumentos(){
    let url = URL_SERVICIOS + '/tipoDocumento';
    url += '?token=' + this._usuarioService.token;

    return this.http.get( url ).pipe( map( (resp: any) => {
      return resp.tipoDocumento;
    }));
  }
}
