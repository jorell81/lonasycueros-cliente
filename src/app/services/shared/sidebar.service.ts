import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any = [{
    titulo: 'Paramétricas',
    icono: 'mdi mdi-gauge',
    submenu: [
      { titulo: 'Categorías', url: '/categorias'},
      { titulo: 'Sub Categorías', url: '/subcategorias'},
      { titulo: 'Productos', url: '/productos'},
      { titulo: 'Gráficas', url: '/graficas1'},
      { titulo: 'Promesas', url: '/promesas'},
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
    ]
  }];

  constructor() { }
}
