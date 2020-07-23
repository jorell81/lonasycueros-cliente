import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styles: []
})
export class ReportesComponent implements OnInit {

  numerosAparecidos = [];
  minimo: number;
  maximo: number;

  constructor() { }

  ngOnInit() {
  }

  numAleatorioSinRepetir(minimo: number, maximo: number) {
    var i;
    /* if (minimo == "reset") {	// Si el primer parámetro es "reset", reinicia la lista de números y sale.
      if (!this.minimo || !this.maximo) return; // Si el rango no está definido, sale.
      this.numerosAparecidos = []; // reinicia matriz
      for (i = this.minimo; i <= this.maximo; i++)
        this.numerosAparecidos.push(i); // Introduce los números del rango.
      return;
    } */

   
    this.minimo = 1; // Guarda el nuevo rango
    this.maximo = 10;
    this.numerosAparecidos = []; // reinicia matriz
    for (i = this.minimo; i <= this.maximo; i++){

      this.numerosAparecidos.push(i); // Introduce los números del rango.
    }
    
    let random = Math.floor(Math.random() * this.numerosAparecidos.length); // Elije una posicion aleatoria
    let numero = this.numerosAparecidos[random]; // Guarda el número de la posición.
    this.numerosAparecidos.splice(random, 1); // Elimina la posición.

    console.log(numero);
    //return numero; // Devuelve el número.
  }


}
