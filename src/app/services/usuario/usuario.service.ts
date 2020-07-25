import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  base_url = environment.base_url;
  public usuario: Usuario;
  menu: any = [];

  constructor(
    private http: HttpClient,
    public router: Router
  ) {}

  get token(): string{
    return sessionStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers: {
        'Bearer': this.token
      }
    };
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.rol;
  }

  // Funcion que permite saber si el usuario esta logueado y paso por el guard de login o si no lo saca
  validarToken(): Observable<boolean>{
    return this.http.get(`${ this.base_url }/login/renew`, this.headers ).pipe(
      map( (resp: any) => {
        const { idUsuario, nombre, apellido, email, rol, estado } = resp.usuario;
        this.usuario = new Usuario( nombre, apellido, email, '', rol, idUsuario, estado);
        sessionStorage.setItem('token', resp.token);
        sessionStorage.setItem('menu', JSON.stringify(resp.menu));
        return true;
      }),
      catchError( error => of(false))
    );
  }

  // Funcion que recibe el email y la contraseña para poder loguearse
  login( usuario: Usuario, recordar: boolean = false){
    document.getElementById('spinner').style.display = 'initial';
    return this.http.post( `${ this.base_url }/login`, usuario).pipe(map((resp: any) => {
      sessionStorage.setItem('token', resp.token);
      sessionStorage.setItem('menu', JSON.stringify(resp.menu));
      if (recordar) {
        localStorage.setItem('email', usuario.email);
      } else {
        localStorage.removeItem('email');
      }
      return true;
    }), catchError( err => {
      document.getElementById('spinner').className = 'preload fadeOut';
      Swal.fire('Error en el login', err.error.msg, 'error');
      return throwError(err);
    }));
  }

  logout(){
    this.usuario = null;
    this.menu = [];
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('menu');
    this.router.navigateByUrl('/login');
    
  }

  cargarUsuarios(){
    const url = `${ this.base_url}/usuarios`;
    return this.http.get( url, this.headers).pipe( map ( (resp: any) => {
      return resp.usuarios;
    }));
  }

  crearUsuario(usuario: Usuario){
    return this.http.post(`${ this.base_url }/usuarios`, usuario, this.headers).pipe( map( resp => {
      console.log(resp);
      Swal.fire('Crear Usuario', 'Usuario creado con exito', 'success');
    }), catchError( err => {
      Swal.fire('Error al crear usuario', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }
  
  actualizarUsuario( usuario: Usuario, cambio: boolean = false){
    return this.http.put(`${ this.base_url }/usuarios/${usuario.idUsuario}/` + cambio, usuario, this.headers ).pipe( map( (resp: any) => {
      console.log(resp);
      Swal.fire('Actualizar Usuario', usuario.nombre + ' ' + usuario.apellido , 'success');
    }), catchError( err => {
      Swal.fire('Error al actualizar usuario', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }
  
  eliminarUsuario(idUsuario: number){
    return this.http.delete(`${ this.base_url }/usuarios/${idUsuario}`, this.headers ).pipe( map( (resp: any) => {
      Swal.fire('Eliminar Usuario', 'El usuario se elimino con exito', 'success');
    }), catchError( err => {
      Swal.fire('Error al eliminar usuario', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }
  



  
}
