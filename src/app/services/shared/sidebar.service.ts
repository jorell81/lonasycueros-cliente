import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {


  public menu = [];

  constructor(
    private router: Router
  ) { }

  cargarMenu(){
    this.menu = JSON.parse(sessionStorage.getItem('menu')) || [];

    if (this.menu.length <= 0) {
      this.router.navigateByUrl('/login');
    }
  }

  /* menu: any = [{
    titulo: 'Paramétricas',
    icono: 'mdi mdi-gauge',
    submenu: [
      { titulo: 'Categorías', url: '/categorias'},
      { titulo: 'Sub Categorías', url: '/subcategorias'},
      { titulo: 'Productos', url: '/productos'},
      { titulo: 'Clientes', url: '/clientes'},
      { titulo: 'Código de Barras', url: '/codigobarras'},
      // { titulo: 'Gráficas', url: '/graficas1'},
      // { titulo: 'Promesas', url: '/promesas'},
    ]
  }];

  menuAdmon: any = [{
    titulo: 'Administración',
    icono: 'mdi mdi-settings',
    submenu: [
      { titulo: 'Usuarios', url: '/usuarios'},
      { titulo: 'Reportes', url: '/reportes'},
    ]
  }];

  menuUser: any = [{
    titulo: 'Operación',
    icono: 'mdi mdi-cash-usd',
    submenu: [
      { titulo: 'Ventas', url: '/ventas'},
      { titulo: 'Mis Ventas', url: '/misventas'},
    ]
  }]; */

  
}
