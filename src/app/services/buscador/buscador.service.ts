import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BuscadorService {

  constructor(
    public http: HttpClient
  ) { }

  buscar( coleccion: string, termino: string){
    let url = URL_SERVICIOS + '/busqueda/coleccion/' + coleccion + '/' + termino;
    return this.http.get(url).pipe( map( (resp: any) => {
      return resp;
    }), catchError( err => {
      Swal.fire('Error buscar colección', err.error.mensaje, 'error');
      return throwError(err);
    }) );
  }
}
