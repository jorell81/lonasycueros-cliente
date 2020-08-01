import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SettingsService,
         SidebarService,
         SharedService,
         UsuarioService,
         CategoriaService,
         SubCategoriaService,
         LoginGuard,
         BuscadorService,
         ProductoService,
         ClienteService,
         DescuentoService,
         VentaService,
         ReporteService,
         TipoDocumentoService } from './service.index';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    LoginGuard,
    SettingsService,
    SidebarService,
    SharedService,
    UsuarioService,
    BuscadorService,
    CategoriaService,
    SubCategoriaService,
    ProductoService,
    ClienteService,
    DescuentoService,
    VentaService,
    ReporteService,
    TipoDocumentoService
  ]
})
export class ServiceModule { }
