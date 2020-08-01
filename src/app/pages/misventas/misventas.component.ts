import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Globales } from '../../config/globales';
import * as XLSX from 'xlsx';
import { ReporteService } from '../../services/reporte/reporte.service';

@Component({
  selector: 'app-misventas',
  templateUrl: './misventas.component.html',
  styles: []
})
export class MisventasComponent implements OnInit {

  pagina = 1;
  itemsPagina = 10;
  forma: FormGroup;
  btnLimpiarFormulario: boolean = false;
  cardReportes: boolean = false;
  reportes = [];
  titulo: string = '';
  idUsuario = '';

  constructor(
    private fb: FormBuilder,
    private _usuarioService: UsuarioService,
    public globales: Globales,
    private _reporteService: ReporteService
  ){
    this.idUsuario = this._usuarioService.usuario.idUsuario;
  }

  ngOnInit() {
    this.crearFormulario();
    this.resetFormulario();
  }

  get fechaInicioNoValido() { return this.forma.get('fechaInicial'); }
  get fechaFinNoValido() { return this.forma.get('fechaFinal'); }

  crearFormulario(){
    this.forma = this.fb.group({
      fechaInicial: [null, [Validators.required]],
      fechaFinal: [null, [Validators.required]]
    });
  }

  resetFormulario(){
    this.forma .reset({
      fechaInicial: null,
      fechaFinal: null
    });
  }

  consultarReporte(){
    console.log('object');
    let data = this.forma.value;
    data.idUsuario = this.idUsuario;
    if ( this.forma.invalid) {
      Object.values( this.forma.controls).forEach( control => {
        control.markAsTouched();
      });
      return false;
    }
    this._reporteService.consultarReportes(data).subscribe( reporte => {
      this.reportes = reporte;
      this.cardReportes = true;
      this.btnLimpiarFormulario = true;
    });
  }

  limpiarFormulario(){
    this.resetFormulario();
    this.btnLimpiarFormulario = false;
    this.cardReportes = false;
    this.reportes = [];
    this.titulo = '';
    this.idUsuario = '';
  }

  descargarReporte($this){
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet($this), 'Resultado');
    XLSX.writeFile(wb, 'Reporte_' + this.titulo + '.xlsx');
  }

}
