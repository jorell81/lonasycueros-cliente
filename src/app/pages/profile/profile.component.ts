import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';

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
    this.cargarUsuario();
    
  }

  cargarUsuario(){
    this.forma.setValue({
      idUsuario: this.usuario.idUsuario,
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      email: this.usuario.email,
      password: null,
      password2: null,
      checkContrasena: false
    });
  }

  verificarPasswordIguales( pwd1: string, pwd2: string){

    return ( group: FormGroup) => {

      let pass1 = group.controls[pwd1].value;
      let pass2 = group.controls[pwd2].value;

      if (pass1 === pass2) {
        return null;
      }
      if (!this.mostrarContrasena){
        return null;
      }
      return {
        passwordIguales : true
      };
    };
  }

  get nombreNoValido() { return this.forma.get('nombre'); }
  get apellidoNoValido() { return this.forma.get('apellido'); }
  get emailNoValido() { return this.forma.get('email'); }
  get passwordNoValido() { return this.forma.get('password'); }
  get password2NoValido() { return this.forma.get('password2'); }




  crearFormulario(){
    this.forma = this.fb.group({
      idUsuario: null,
      nombre: [ null, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      apellido: [ null, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      email: [ null, [Validators.required, Validators.email]],
      password: [ null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password2: [ null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      checkContrasena: false
    }, { validators: this.verificarPasswordIguales('password', 'password2')});
  }

  actualizarUsuario(){
    
    let validarContrasena = true;
    let errores = false;
    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach((control, i, e) => {
        if (control.invalid) {
          //console.log('nombre', Object.keys(this.forma.controls)[i]);
          if (
            (!this.mostrarContrasena && Object.keys(this.forma.controls)[i] === 'password') ||
            (!this.mostrarContrasena && Object.keys(this.forma.controls)[i] === 'password2') ||
            (!this.mostrarContrasena && Object.keys(this.forma.controls)[i] === 'checkContrasena')) {
            validarContrasena = false;
          } else {
            errores = true;
            control.markAsTouched();
          }
        }
      });
      if (validarContrasena || errores) {
        return false;
      }
    }

    let usuarioBD = {
      idUsuario: this.forma.value.idUsuario !== null ? this.forma.value.idUsuario : null,
      nombre: this.forma.value.nombre,
      apellido: this.forma.value.apellido,
      email: this.forma.value.email,
      contrasena: this.mostrarContrasena ? this.forma.value.password : null,
      rol: this.usuario.rol,
      estado: this.usuario.estado
    };

    /* this.usuario.nombre = this.forma.value.nombre;
    this.usuario.apellido = this.forma.value.apellido;
    this.usuario.email = this.forma.value.email;
    this.usuario.contrasena = (this.forma.value.password !== '')? this.forma.value.password : null;
    this.usuario.rol = this.usuario.rol;
    this.usuario.estado = this.usuario.estado; */

    this._usuarioService.actualizarUsuario( usuarioBD, validarContrasena ).subscribe( resp => {
      this.usuario.nombre = usuarioBD.nombre;
      this.usuario.apellido = usuarioBD.apellido;
      this.usuario.email = usuarioBD.email;
      this.forma.controls.checkContrasena.reset(false);
      this.onChange(false);
    });

    

  }

  onChange(event){
    this.mostrarContrasena = event;
    if (!event) {
      this.forma.controls.password.reset(null);
      this.forma.controls.password2.reset(null);
      this.cargarUsuario();
    }
  }



}
