import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscador'
})
export class BuscadorPipe implements PipeTransform {

  transform(coleccion: string, termino: string): any {
    return console.log('entramos al pipe');
  }

}
