import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/service.index';
import { NgForm } from '@angular/forms';
import { Usuario } from '../models/usuario.model';



declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  recordar: boolean = false;

  constructor(public router: Router,
              public _usuarioService: UsuarioService) { }

  ngOnInit() {
    init_plugins();
    this.email = localStorage.getItem('email') || ''; 
    if (this.email.length > 1) {
      this.recordar = true;
    }
  }

  ingresar( forma: NgForm ) {

    if (forma.invalid) {
      return;
    }
    
    let usuario = new Usuario(null, null, forma.value.email, forma.value.password);


    this._usuarioService.login(usuario, forma.value.recordar).subscribe(resp => {
      this.router.navigate(['/ventas']);
    });
  }

}
