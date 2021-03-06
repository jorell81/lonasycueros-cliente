import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlipModule } from 'ngx-flip';
import { NgxBarcodeModule } from 'ngx-barcode';



import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PagesComponent } from './pages.component';
import { PAGES_ROUTES } from './pages.routes';
import { MonedaPipe } from '../pipes/formatos.pipe';

// temporal
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';
import { LoadingComponent } from '../components/loading/loading.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { SubCategoriasComponent } from './sub-categorias/sub-categorias.component';
import { ProductosComponent } from './productos/productos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ReportesComponent } from './reportes/reportes.component';
import { VentasComponent } from './ventas/ventas.component';
import { ProfileComponent } from './profile/profile.component';
import { ClientesComponent } from './clientes/clientes.component';
import { CodigobarrasComponent } from './codigobarras/codigobarras.component';
import { MisventasComponent } from './misventas/misventas.component';
import { DescuentosComponent } from './descuentos/descuentos.component';



@NgModule({
    declarations: [
        PagesComponent,
        ProgressComponent,
        Graficas1Component,
        IncrementadorComponent,
        GraficoDonaComponent,
        LoadingComponent,
        AccountSettingsComponent,
        PromesasComponent,
        CategoriasComponent,
        SubCategoriasComponent,
        ProductosComponent,
        UsuariosComponent,
        ReportesComponent,
        VentasComponent,
        ProfileComponent,
        ClientesComponent,
        MonedaPipe,
        CodigobarrasComponent,
        MisventasComponent,
        DescuentosComponent
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
        NgSelectModule,
        FormsModule,
        ChartsModule,
        CommonModule,
        ReactiveFormsModule,
        NgbModule,
        FlipModule,
        NgxBarcodeModule
    ]
})
export class PagesModule { }
