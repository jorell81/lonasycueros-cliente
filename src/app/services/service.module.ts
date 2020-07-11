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
         ProductoService } from './service.index';



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
    ProductoService
  ]
})
export class ServiceModule { }
