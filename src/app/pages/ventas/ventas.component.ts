import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import Quagga from 'quagga';
import { Producto } from 'src/app/models/producto.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductoService } from '../../services/producto/producto.service';
import { environment } from '../../../environments/environment';
import { DetalleVenta } from '../../models/detalle-venta.model';
import { ClienteService } from '../../services/cliente/cliente.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { VentaService } from '../../services/venta/venta.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styles: []
})
export class VentasComponent implements OnInit {
  
  // venta: Venta = new Venta();
  numCliente = null;
  flip: boolean = false;
  productosVenta = [];
  objVenta: DetalleVenta;
  usuarios: Usuario[] = [];
  alertCliente: boolean = false;
  forma: FormGroup;
  iva: number = environment.iva;
  subtotal: number = 0;
  totalVenta: number = 0;
  valorIva: number = 0;
  cantidad: number = 0;
  descontar = 0;
  clienteVenta: boolean = false;
  mostrarCliente: boolean = false;

  
  

  constructor(
    public fb: FormBuilder,
    private _productoService: ProductoService,
    private _clienteService: ClienteService,
    private _usuarioService: UsuarioService,
    private _ventaService: VentaService
  ) {
    
  }

  ngOnInit() {
    this.crearFormulario();
    this.resetearFormulario();
    this.ActivarImpresora();
    this.cargarUsuarios();
    this.focusCampoCodebar();
  }

  get nombreClienteNoValido() { return this.forma.get('nombreCliente'); }
  get usuarioNoValido() { return this.forma.get('idUsuario'); }


  crearFormulario(){
    this.forma = this.fb.group({
      idCliente: null,
      nombreCliente: [null, [Validators.required]],
      barCode: [null, [Validators.minLength(2), Validators.maxLength(16)]],
      idUsuario: [null, [Validators.required]]
    });
  }

  resetearFormulario(){
    this.forma.reset({
      idCliente: null,
      nombreCliente: null,
      barCode: null,
      idUsuario: null
    });
  }

  cargarUsuarios(){
    this._usuarioService.cargarUsuarios().subscribe( usuarios => {
      this.usuarios = usuarios;
    });
  }

  ActivarImpresora() {
    const App = this;
    new Promise((resolve, reject) => {
      fetch('http://localhost:8000', {
        method: 'GET',
        mode: 'cors'
      })
        .then(response => {
          return response.json();
        })
        .then(responseText => {
          // App.BtnGuardar = true;
        }).catch(err => {
          // Swal.fire('Impresora', 'Problema al conectar con la impresora 1', 'error');
        });
    }).catch(err => {
      // Swal.fire('Impresora', 'Problema al conectar con la impresora 2', 'error');
    });
    this.focusCampoCodebar();
  }

  consultarProducto(){
    let codigoBarras = this.forma.value.barCode;
    this.descontar = 0;
    let descuentoTotal = 0;
    if (codigoBarras === null) {
      return Swal.fire('Ventas', 'Debe ingresar el código de un producto', 'error');
    }
    this._productoService.consultarProductoxCodigoBarras(codigoBarras).subscribe( producto => {
      if (producto.length <= 0) {
        return Swal.fire('Ventas', 'El producto consultado no existe en la BD', 'error');
      }
      if (producto[0].bodega <= 0) {
        return Swal.fire('Ventas', 'No hay stock de este producto', 'warning');
      }
      if (producto.length >= 1 && producto[0].valorDescuento > 0) {
        producto.forEach( element => {
          descuentoTotal += element.valorDescuento;
        });
        this.descontar = producto[0].valorSalida * (descuentoTotal / 100);
      }
      let itemsVenta = {
        idProducto: null,
        nombre: null,
        codigoBarras: null,
        descuento: null,
        valorSalida: null,
        subTotal: null,
        iva: null,
        cantidad: null,
        bodega: null,
        valorDescuento: null
      };

      const index = this.productosVenta.map((productoTemp, i) => {
        if (productoTemp.codigoBarras === producto[0].codigoBarras) {
          return i + 1;
        }
        return 0;
      }).reduce((a, b) => a + b, 0);
      if (index <= 0) {
        itemsVenta.idProducto = producto[0].idProducto;
        itemsVenta.nombre = producto[0].nombre;
        itemsVenta.descuento = producto[0].valorDescuento !== 0 ? descuentoTotal : producto[0].valorDescuento;
        itemsVenta.subTotal = producto[0].valorSalida - this.descontar;
        itemsVenta.codigoBarras = producto[0].codigoBarras;
        itemsVenta.valorSalida = producto[0].valorSalida;
        itemsVenta.iva = producto[0].valorSalida * this.iva;
        itemsVenta.cantidad = 1;
        itemsVenta.bodega = producto[0].bodega - itemsVenta.cantidad;
        itemsVenta.valorDescuento = this.descontar;
        
        this.totalVenta += itemsVenta.subTotal;
        this.productosVenta.push(itemsVenta);
        
      } else {
        this.productosVenta.forEach( (object, key) => {
          if (object.codigoBarras === producto[0].codigoBarras) {
            if (this.productosVenta[key].bodega <= 0) {
              return Swal.fire('Ventas', 'No hay stock de este producto', 'warning');
            }
            this.productosVenta[key].subTotal += producto[0].valorSalida - this.descontar;
            this.productosVenta[key].iva += this.productosVenta[key].valorSalida * this.iva;
            this.productosVenta[key].cantidad = this.productosVenta[key].cantidad + 1;
            this.productosVenta[key].bodega = this.productosVenta[key].bodega - 1;
            this.productosVenta[key].valorDescuento += this.descontar;
            
            this.totalVenta += producto[0].valorSalida - this.descontar;
          }
        });
      }
      this.forma.controls.barCode.reset(null);
      this.focusCampoCodebar();
    });

  }

  CrearFacturaVenta(){
    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach(control => {
        control.markAsTouched();
      });
      return false;
    }
    if (this.mostrarCliente) {
      this.ActivarImpresora();
      
      let objVenta = {
        idCliente: this.forma.value.idCliente,
        idUsuario: this.forma.value.idUsuario,
        valorTotalVenta: this.totalVenta,
        detalleVenta: this.productosVenta
      };
      this._ventaService.crearVenta(objVenta).subscribe( venta => {
        if (venta > 0) {
          console.log('llamar la impresora');
          new Promise((resolve, reject) => {
            fetch('http://localhost:8000', {
              method: 'POST',
              mode: 'cors',
              body: JSON.stringify(objVenta)
            })
              .then(response => {
                console.log('1', response);
                return response.json();
              })
              .then(responseText => {
                console.log('2', responseText);
              }).catch(err => {
                console.log('err2', err);
                reject(err);
              });
          }).catch(err => {
            console.log('err', err);
            console.log(err);
          });
          this.limpiarVenta();
        }
      });
      this.focusCampoCodebar();
      // console.log('Se guarda la venta', objVenta);
    } else {
      Swal.fire('Venta', 'Debe consulta el cliente', 'error');
    }
    
  }

  removerProducto($this){
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
        this.productosVenta.forEach( (object, key) => {
          if (object.codigoBarras === $this.codigoBarras){
            this.productosVenta.splice(key, 1);
            this.totalVenta = this.totalVenta - object.subTotal;
          }
          
        });
      }
    });
  }

  removerUnProducto($this){
    Swal.fire({
      title: 'Confirmación',
      text: 'Removera un producto de ' + $this.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.productosVenta.forEach( (object, key) => {
          if (object.codigoBarras === $this.codigoBarras){
            this.productosVenta[key].cantidad = this.productosVenta[key].cantidad - 1;
            this.productosVenta[key].subTotal = this.productosVenta[key].subTotal - this.productosVenta[key].valorSalida;
            this.productosVenta[key].iva = this.productosVenta[key].iva - (this.productosVenta[key].valorSalida * this.iva);
            this.totalVenta = this.totalVenta - object.valorSalida;
          }
          
        });
      }
    });
  }

  buscarCliente(numCliente){
    if (this.forma.controls.nombreCliente.errors) {
      return this.forma.controls.nombreCliente.markAsTouched();
    }
    this._clienteService.consultarClientexNumDocumento(numCliente).subscribe( cliente => {
      console.log(cliente);
      if (cliente.length > 0) {
        this.forma.controls.idCliente.setValue(cliente[0].idCliente);
        this.forma.controls.nombreCliente.setValue(`${cliente[0].nombre} ${cliente[0].apellido}`);
        this.focusCampoCodebar();
        this.mostrarCliente = !this.mostrarCliente;
      } else {
        this.alertCliente = true;
        this.mostrarCliente = false
        this.numCliente = numCliente;
        this.focusCampoCodebar();
      }
    });
    
  }


  registrarCliente(){
    this.flip = !this.flip;
    this.clienteVenta = true;
  }

  cerrarAlert(){
    this.alertCliente = false;
  }

  SeleccionarCliente($event){
    this.flip = !this.flip;
    if ($event !== null) {
      this.alertCliente = !this.alertCliente;
      this.forma.controls.idCliente.setValue($event.idCliente);
      this.forma.controls.nombreCliente.setValue(`${($event.nombre).toUpperCase()} ${($event.apellido).toUpperCase()}`);
      this.mostrarCliente = !this.mostrarCliente;
      this.focusCampoCodebar();
    }
  }

  focusCampoCodebar(){
    document.getElementById('barCode').focus();
  }

  borrarCliente(){
    this.forma.controls.nombreCliente.reset(null);
    this.mostrarCliente = false;
  }

  limpiarVenta(){
    this.resetearFormulario();
    this.productosVenta = [];
    this.subtotal = 0;
    this.totalVenta = 0;
    this.valorIva = 0;
    this.cantidad = 0;
    this.descontar = 0;
    this.clienteVenta = false;
    this.mostrarCliente = false;
  }

  CambioSelect($event){
    if ($event > 0) {
      this.focusCampoCodebar();
    }
  }

}
