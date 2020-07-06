import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(
    public http: HttpClient,
    public router: Router
  ) { 
    console.log('Servicio de usuario listo');
    this.cargarStorage();
  }

  // Funcion que permite saber si el usuario esta logueado y paso por el guard de login o si no lo saca
  estaLogueado(){
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage(){
    if (sessionStorage.getItem('token')) {
      this.token = sessionStorage.getItem('token');
      this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
      // this.menu = JSON.parse(sessionStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      // this.menu = [];

    }
  }
  

  // Funcion que guarda los datos de sesión en el sessionStorage
  guardarSessionStorage(id: string, token: string, usuario: Usuario){
    sessionStorage.setItem('id', id);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
    // sessionStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    // this.menu = menu;
  }
  

  // Funcion que recibe el email y la contraseña para poder loguearse
  login( usuario: Usuario, recordar: boolean = false){
    
    console.log(usuario);
    let url = URL_SERVICIOS + '/login';
    return this.http.post( url, usuario).pipe(map((resp: any) => {
      this.guardarSessionStorage(resp.id, resp.token, resp.usuario);
      if (recordar) {
        localStorage.setItem('email', usuario.email);
      } else {
        localStorage.removeItem('email');
      }
      return true;
    }), catchError( err => {
      Swal.fire('Error en el login', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }

  logout(){
    this.usuario = null;
    this.token = '';
    this.menu = [];
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('id');
    // sessionStorage.removeItem('menu');

    this.router.navigate(['/login']);
    
  }

  actualizarUsuario( usuario: Usuario){
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put( url, usuario).pipe( map( (resp: any) => {
      let usuarioDB: Usuario = resp.usuario;
      this.guardarSessionStorage( usuarioDB._id, this.token, usuarioDB);
      Swal.fire('Actualizar Usuario', usuario.nombre + ' ' + usuario.apellido , 'success');
    }), catchError( err => {
      Swal.fire('Error al actualizar usuario', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }
  
}
