import { Component, OnInit, Inject } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { Globales } from '../../config/globales';
import { BuscadorService } from '../../services/buscador/buscador.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  flip: boolean = false;
  pagina = 1;
  itemsPagina = 10;
  usuarios: Usuario[] = [];
  usuarioBD = {}
  usuario: Usuario;
  cantBusqueda: number = 0;
  forma: FormGroup;
  mostrarContrasena: boolean = false;
  mostrarCheck: boolean = false;
  mostrarActivo: boolean = false;
  mostrarSinResultado: boolean = false
  roles = [
    { nombre: 'Administrador', value: 'ADMIN_ROLE'},
    { nombre: 'Vendedor', value: 'USER_ROLE'}
  ];

  constructor(
    @Inject(DOCUMENT) private _document,
    private _usuarioService: UsuarioService,
    private _buscador: BuscadorService,
    public globales: Globales,
    private fb: FormBuilder
  ) { 
    this.usuario = _usuarioService.usuario;
  }

  ngOnInit() {
    this.cargarUsuarios();
    this.crearFormulario();
  }

  get nombreNoValido() { return this.forma.get('nombre'); }
  get apellidoNoValido() { return this.forma.get('apellido'); }
  get emailNoValido() { return this.forma.get('email'); }
  get passwordNoValido() { return this.forma.get('password'); }
  get password2NoValido() { return this.forma.get('password2'); } 
  get rolNoValido() { return this.forma.get('rol'); } 

  crearFormulario(){
    this.forma = this.fb.group({
      idUsuario: null,
      nombre: [ null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      apellido: [ null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: [ null, [Validators.required, Validators.email]],
      password: [ null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password2: [ null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      rol: [null, Validators.required],
      estado: false,
      checkContrasena: false
    }, { validators: this.verificarPasswordIguales('password', 'password2')});
  }

  verificarPasswordIguales( pwd1: string, pwd2: string){

    return ( group: FormGroup) => {

      let pass1 = group.controls[pwd1].value;
      let pass2 = group.controls[pwd2].value;

      if (pass1 === pass2) {
        return null;
      }
      return {
        passwordIguales : true
      };
    };
  }

  resetFormulario(){
    this.mostrarActivo = false;
    this.forma.reset({
      idUsuario: null,
      nombre: null,
      apellido: null,
      email: null,
      password: null,
      password2: null,
      rol: null,
      estado: false,
      checkContrasena: false
    });
  }

  cargarUsuarios(){
    this._usuarioService.cargarUsuarios().subscribe( (usuarios) => {
      this.usuarios = usuarios;
    });
  }


  agregarusuario(){
    this.flip = !this.flip;
    this.mostrarContrasena = true;
    this.mostrarCheck = false;
    this.mostrarActivo = false;
    this.resetFormulario();

  }

  guardarUsuario(){
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
      rol: this.forma.value.rol,
      estado: this.forma.value.estado
    };
    
    this._usuarioService[this.forma.value.idUsuario !== null ? 'actualizarUsuario' : 'crearUsuario'](usuarioBD).subscribe( (resp: any) => {
      this.cargarUsuarios();
      this.flip = !this.flip;
      this.cantBusqueda = 0;
      this._document.getElementById('buscador').value = '';
      this.forma.controls.checkContrasena.reset(false);
      this.onChange(false);
      this.resetFormulario();
    });
  }

  actualizarUsuario($this){
    if ($this.idUsuario === this.usuario.idUsuario) {
      return Swal.fire('Actualizar Usuario','No se puede modificar a usted mismo', 'error');
    }
    this.flip = !this.flip;
    this.mostrarCheck = true;
    this.mostrarContrasena = false;
    this.mostrarActivo = true;
    this.forma.reset({
      idUsuario: $this.idUsuario,
      nombre: $this.nombre,
      apellido: $this.apellido,
      email: $this.email,
      password: $this.password,
      password2: $this.password2,
      rol: $this.rol,
      estado: $this.estado,
      checkContrasena: false
    });
  }

  eliminarUsuario($this){
    Swal.fire({
      title: 'Confirmación',
      text: 'Eliminara el usuario ' + $this.nombre + ' ' + $this.apellido,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        let idUsuario = $this.idUsuario;
        this._usuarioService.eliminarUsuario( idUsuario).subscribe( resp => {
          this.cargarUsuarios();
        });
      }
    });
    
  }

  buscar( termino: string){
    if (termino && termino.length > 2) {
      this._buscador.buscar('usuario', termino).subscribe( resp => {
        if (resp.usuario.length > 0) {
            this.usuarios = resp.usuario;
            this.cantBusqueda = resp.usuario.length;
            this.mostrarSinResultado = false;
        } else {
          this.cantBusqueda = 0;
          this.mostrarSinResultado = true;
          this.usuarios = [];
        }
      });
    } else if ( termino === '') {
      document.getElementById('buscador').blur();
      console.log('object');
      this.cantBusqueda = 0;
      this.mostrarSinResultado = false;
      this.cargarUsuarios();
    }
  }

  regresar(){
    if (this.forma.dirty) {
      Swal.fire({
        title: 'Confirmación',
        text: '¿Esta seguro, puede perder información?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.value) {
          this.flip = false;
        }
      });
    } else {
      this.flip = false;
    }
  }

  onChange(event){
    this.mostrarContrasena = event;
    if (!event) {
      this.forma.controls.password.reset(null);
      this.forma.controls.password2.reset(null);
    }
  }

}
