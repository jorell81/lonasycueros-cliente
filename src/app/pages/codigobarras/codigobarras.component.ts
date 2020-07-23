import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from '../../services/service.index';
import { Globales } from '../../config/globales';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CanActivate } from '@angular/router';

@Component({
  selector: 'app-codigobarras',
  templateUrl: './codigobarras.component.html',
  styleUrls: ['./codigobarras.component.css']
})
export class CodigobarrasComponent implements OnInit {

  imprimirCodigos: Producto[] = [];
  misCodigos = [];
  productos: Producto[] = [];
  forma: FormGroup;
  CodigoBarras: string = null;
  alerta = false;
  pagina = 1;
  itemsPagina = 10;
  cantidadTotal: number = 0;


  constructor(
    private _productoService: ProductoService,
    public globales: Globales,
    public fb: FormBuilder
  ) { 
    
  }

  ngOnInit() {
    this.cargarProductos();
    this.crearFormulario();
    this.resetFormulario();
  }

  get codigoNoValido() { return this.forma.get('codigoBarras'); }
  get cantidadNoValida() { return this.forma.get('cantidad'); }

  crearFormulario() {
    this.forma = this.fb.group({
      codigoBarras: [null, Validators.required],
      cantidad: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],

    });
  }

  resetFormulario(){
    this.forma.reset({
      codigoBarras: null,
      CanActivate: null
    });
  }

  cargarProductos() {
    this._productoService.cargarProductos().subscribe((productos: any) => {
      this.productos = productos;
    });
  }

  AgregarProducto() {
    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach(control => {
        control.markAsTouched();
      });
      return false;
    }
    let codigosDeBarra = {
      id: null,
      nombre: null,
      items: []
    };



    this.CodigoBarras = this.forma.value.codigoBarras;
    let cantidad = this.forma.value.cantidad;
    this.cantidadTotal += cantidad;

    if (this.cantidadTotal > 45) {
      Swal.fire('Codigos de Barra', 'La cantidad total no puede ser mayor a 45 codigos', 'warning');
      this.cantidadTotal -= cantidad;
      return;
    }

    const index = this.misCodigos.map((productoTemp, i) => {
      if (productoTemp.id === this.CodigoBarras) {
        return i + 1;
      }
      return 0;
    }).reduce((a, b) => a + b, 0);

    const res = this.productos.filter((item, i) => {
      return item.codigoBarras === this.CodigoBarras;
    } );
    if (index <= 0) {
      codigosDeBarra.id = res[0].codigoBarras;
      codigosDeBarra.nombre = res[0].nombre;
      for (let i = 0; i < cantidad; i++) {
        codigosDeBarra.items.push(res[0]);
      }
      this.misCodigos.push(codigosDeBarra);
      this.resetFormulario();
    } else {
      // el producto ya existe en la lista
      for (let i = 0; i < this.misCodigos.length; i++) {
        if (this.misCodigos[i].id === res[0].codigoBarras) {
          for (let j = 0; j < cantidad; j++) {
            this.misCodigos[i].items.push(res[0]);
          }
        }
      }
      this.resetFormulario();
    }
  }

  removerProducto($this) {
    Swal.fire({
      title: 'Confirmación',
      text: 'Removera el producto ' + $this.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.removerMisCodigos($this.id);
      }
    });

  }

  removerMisCodigos(id: string){
    for (let i = 0; i < this.misCodigos.length; i++) {
      if (this.misCodigos[i].id === id) {
        this.cantidadTotal -= this.misCodigos[i].items.length;
        console.log(this.misCodigos[i], i);
        this.misCodigos.splice(i, 1);
      }
    }
  }



  ImprimirCodigos() {
    document.getElementById('spinner').style.display = 'initial';
    this.imprimirCodigos = [];
    for (const iterator of this.misCodigos) {
      for (const iterator2 of iterator.items) {
        this.imprimirCodigos.push(iterator2);
      }
    }

    setTimeout( () => {
      document.getElementById('spinner').className = 'preload fadeOut';
      const myWindow = window.open('', '', 'width=1000,height=850');
      myWindow.document.write(document.getElementById('Imprime').innerHTML + '<style>body{padding:0;margin:0;} .Contenedor { display: block; width: 19.1cm; height: 24.9cm; } .Item { width: 3.5cm; height: 2.5cm; margin-right: 0.4cm; margin-bottom: 0.4cm; display: inline-block; background: white; overflow: hidden; -webkit-box-shadow: inset 0px 0px 0px 1px #eee; -moz-box-shadow: inset 0px 0px 0px 1px #eee; box-shadow: inset 0px 0px 0px 1px #eee; } label { margin: 0; padding: 0; } .Item:nth-child(5n) { margin-right: 0px; } .Nombre { display: block; width: 100%; text-align: left; padding: 0 0 0 10px; font-size: 11px; font-weight: bold; text-transform: uppercase; } .Detalle { display: block; width: 100%; text-transform: uppercase; text-align: left; padding: 0 0 0 10px; font-size: 9px; } .Valor { display: block; width: 90%; text-align: right; padding: 0 0 0 0; font-size: 12px; } .Codigo { display: block; width: 100%; text-align: center; padding: 0; } .divisor { display: block; width: 100%; padding: 5px 0 0 0; }</style>');
      myWindow.document.close();
      myWindow.focus();
      myWindow.print();
      // myWindow.close();
    }, 1000);
    
  }

}
