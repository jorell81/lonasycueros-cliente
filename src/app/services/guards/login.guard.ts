import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
  ){}

  canActivate(){

    if (this._usuarioService.estaLogueado()) {
      console.log('Paso por el login guard');
      return true;
    } else {
      console.log('Bloqueado por el login guard');
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
