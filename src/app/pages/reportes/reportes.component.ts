import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { ReporteService } from 'src/app/services/reporte/reporte.service';
import { Globales } from '../../config/globales';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styles: []
})
export class ReportesComponent implements OnInit {

  pagina = 1;
  itemsPagina = 10;
  forma: FormGroup;
  usuarios: Usuario[] = [];
  mostrarFechas: boolean = true;
  mostrarVendedor: boolean = false;
  btnLimpiarFormulario: boolean = false;
  btnDownloadInventario: boolean = false;
  cardReportes: boolean = false;
  loading: boolean = false;
  reportes = [];
  inventario = [];
  titulo:string = '';
  tipoReporte = [
    {tipo: 1, reporte: 'TODOS LOS VENDEDORES'},
    {tipo: 2, reporte: 'VENDEDOR'},
    {tipo: 3, reporte: 'INVENTARIO'},
  ];


  constructor(
    private fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private _reporteService: ReporteService,
    public globales: Globales
  ) { }

  get fechaInicioNoValido() { return this.forma.get('fechaInicial'); }
  get fechaFinNoValido() { return this.forma.get('fechaFinal'); }
  get tipoReporteNoValido() { return this.forma.get('idTipoReporte'); }
  get usuarioNoValido() { return this.forma.get('idUsuario'); }
  

  ngOnInit() {

    this.crearFormulario();
    this.resetFormulario();
    this.cargarUsuario();
  }

  cargarUsuario(){
    this._usuarioService.cargarUsuarios().subscribe( usuarios => {
      this.usuarios = usuarios;
    });
  }


  crearFormulario(){
    this.forma = this.fb.group({
      idUsuario: [null, [Validators.required]],
      fechaInicial: [null, [Validators.required]],
      fechaFinal: [null, [Validators.required]],
      idTipoReporte: [null, [Validators.required]],
    }, { validators: this.verificarfechas('fechaInicial', 'fechaFinal')});
  }

  resetFormulario(){
    this.forma.reset({
      idUsuario: null,
      fechaInicial: null,
      fechaFinal: null,
      idTipoReporte: null
    });
  }

  verificarfechas( fechaInicio: string, fechaFin: string){

    return ( group: FormGroup) => {

      let fechaInicial = group.controls[fechaInicio].value;
      let fechaFinal = group.controls[fechaFin].value;

      if (fechaInicial <= fechaFinal) {
        return null;
      }
      return {
        problemaFechas : true
      };
    };
  }

  consultarReporte(){
    const data = this.forma.value;
    let validarReporte = true;
    let errores = false;
    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach((control, i) => {
        if (control.invalid) {
          //console.log('nombre', Object.keys(this.forma.controls)[i]);
          if (
            (!this.mostrarFechas && Object.keys(this.forma.controls)[i] === 'fechaInicial') ||
            (!this.mostrarFechas && Object.keys(this.forma.controls)[i] === 'fechaFinal') ||
            (!this.mostrarVendedor && Object.keys(this.forma.controls)[i] === 'idUsuario')) {
              validarReporte = false;
          } else {
            errores = true;
            control.markAsTouched();
          }
        }
      });
      if (validarReporte || errores) {
        console.log("error");
        return false;
      }
    }

    switch (data.idTipoReporte) {
      case 1:
        this._reporteService.consultarReportes(data).subscribe( reporte => {
          this.titulo = 'General Vendedores';
          this.reportes = reporte;
          this.btnLimpiarFormulario = true;
          this.btnDownloadInventario = false;
          this.cardReportes = true;
        });
        break;
      case 2:
        this._reporteService.consultarReportes(data).subscribe( reporte => {
          this.titulo = 'por Vendedor';
          this.reportes = reporte;
          this.btnLimpiarFormulario = true;
          this.btnDownloadInventario = false;
          this.cardReportes = true;
        });
        break;
      case 3:
        this.loading = true;
        this._reporteService.consultarInventario().subscribe( inventario => {
          this.titulo = 'Inventario';
          this.btnDownloadInventario = true;
          this.btnLimpiarFormulario = true;
          this.cardReportes = true;
          this.descargarReporte(inventario);
          Swal.fire('Inventario', 'Inventario descargado con exito', 'success');
          
        });
        break;
    }
  }

  CambioSelect($event){
    switch ($event) {
      case 2:
        this.mostrarFechas = true;
        this.mostrarVendedor = true;
        break;
      case 3:
        this.mostrarFechas = false;
        this.mostrarVendedor = false;
        break;
      default:
        this.mostrarFechas = true;
        this.mostrarVendedor = false;
    }
  }

  descargarReporte($this) {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet($this), 'Resultado');
    XLSX.writeFile(wb, 'Reporte_' + this.titulo + '.xlsx');
    this.loading = false;
  }

  limpiarFormulario(){
    this.mostrarFechas = true;
    this.mostrarVendedor = false;
    this.btnLimpiarFormulario = false;
    this.btnDownloadInventario = false;
    this.cardReportes = false;
    this.loading = false;
    this.reportes = [];
    this.inventario = [];
    this.titulo = '';
    this.resetFormulario();
  }

}
