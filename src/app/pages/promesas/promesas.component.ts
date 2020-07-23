import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoService } from '../../services/service.index';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  productos: Producto[] = [];
  simpleItems = [];

    constructor(public _productoService: ProductoService) {
    }

    ngOnInit() {
        this._productoService.cargarProductos().subscribe( (resp: any) => {
          this.productos = resp;
          console.log(resp);
        });
        this.simpleItems = [true, 'Two', 3];
    }

  


    

}
