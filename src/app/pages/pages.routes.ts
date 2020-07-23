import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { SubCategoriasComponent } from './sub-categorias/sub-categorias.component';
import { ProductosComponent } from './productos/productos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ReportesComponent } from './reportes/reportes.component';
import { LoginGuard } from '../services/guards/login.guard';
import { VentasComponent } from './ventas/ventas.component';
import { ProfileComponent } from './profile/profile.component';
import { ClientesComponent } from './clientes/clientes.component';
import { CodigobarrasComponent } from './codigobarras/codigobarras.component';
import { MisventasComponent } from './misventas/misventas.component';
import { AdminGuard } from '../services/guards/admin.guard';



const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [ LoginGuard],
        children: [
            { path: 'perfil', component: ProfileComponent, data: { titulo: 'Perfil de usuario'} },
            { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes del tema'} },
            { path: 'ventas', component: VentasComponent, data: { titulo: 'Ventas'} },
            { path: 'misventas', component: MisventasComponent, data: { titulo: 'Mis Ventas'} },


            // Rutas de Administrador
            { path: 'categorias', canActivate: [ AdminGuard ], component: CategoriasComponent, data: { titulo: 'Categorías'} },
            { path: 'subcategorias', canActivate: [ AdminGuard ], component: SubCategoriasComponent, data: { titulo: 'Sub Categorías'} },
            { path: 'productos', canActivate: [ AdminGuard ], component: ProductosComponent, data: { titulo: 'Productos'} },
            { path: 'clientes', canActivate: [ AdminGuard ], component: ClientesComponent, data: { titulo: 'Clientes'} },
            { path: 'codigobarras', canActivate: [ AdminGuard ], component: CodigobarrasComponent, data: { titulo: 'Código de barras'} },
            { path: 'usuarios', canActivate: [ AdminGuard ], component: UsuariosComponent, data: { titulo: 'Usuarios'} },
            { path: 'reportes', canActivate: [ AdminGuard ], component: ReportesComponent, data: { titulo: 'Reportes'} },
            /* { path: 'progress', component: ProgressComponent, data: { titulo: 'Progress'} },
            { path: 'graficas1', component: Graficas1Component, data: { titulo: 'Graficas'} },
            { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas'} }, */
            { path: '', redirectTo: '/ventas', pathMatch: 'full' }
        ]
    },
];


export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
