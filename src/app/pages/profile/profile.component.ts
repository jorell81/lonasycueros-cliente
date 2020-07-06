import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { group } from 'console';
import { ClientRequest } from 'http';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  forma: FormGroup;
  usuario: Usuario;
  mostrarContrasena: boolean = false;

  constructor(
    private fb: FormBuilder,
    public _usuarioService: UsuarioService
  ) {
    this.crearFormulario();
    this.usuario = this._usuarioService.usuario;
  }

  ngOnInit() {

    this.forma.setValue({
      _id: this.usuario._id,
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      email: this.usuario.email
    });
  }

  get nombreNoValido() { return this.forma.get('nombre').invalid && this.forma.get('nombre').touched; }
  get apellidoNoValido() { return this.forma.get('apellido').invalid && this.forma.get('apellido').touched; }
  get emailNoValido() { return this.forma.get('email').invalid && this.forma.get('email').touched; }




  crearFormulario(){
    this.forma = this.fb.group({
      _id: null,
      nombre: [ null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      apellido: [ null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      email: [ null, [Validators.required, Validators.email]],
    });
  }

  actualizarUsuario(){
    
    if ( this.forma.invalid) {
      Object.values( this.forma.controls).forEach( control => {
        control.markAsTouched();
      });
      return false;
    }
    
    this.usuario.nombre = this.forma.value.nombre;
    this.usuario.apellido = this.forma.value.apellido;
    this.usuario.email = this.forma.value.email;
    this._usuarioService.actualizarUsuario( this.usuario ).subscribe();
    

  }



}
