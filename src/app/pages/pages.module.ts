import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PagesComponent } from './pages.component';
import { PAGES_ROUTES } from './pages.routes';

// temporal
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { SubCategoriasComponent } from './sub-categorias/sub-categorias.component';
import { ProductosComponent } from './productos/productos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ReportesComponent } from './reportes/reportes.component';
import { VentasComponent } from './ventas/ventas.component';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
    declarations: [
        PagesComponent,
        ProgressComponent,
        Graficas1Component,
        IncrementadorComponent,
        GraficoDonaComponent,
        AccountSettingsComponent,
        PromesasComponent,
        CategoriasComponent,
        SubCategoriasComponent,
        ProductosComponent,
        UsuariosComponent,
        ReportesComponent,
        VentasComponent,
        ProfileComponent
    ],
    exports: [
        CategoriasComponent,
        SubCategoriasComponent,
        ProductosComponent,
        UsuariosComponent,
        ReportesComponent,
        ProgressComponent,
        Graficas1Component
    ],
    imports: [
        SharedModule,
        PAGES_ROUTES,
        FormsModule,
        ChartsModule,
        CommonModule,
        ReactiveFormsModule,
        NgbModule
    ]
})
export class PagesModule { }