import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'Moneda' })
export class MonedaPipe implements PipeTransform {
    transform(Numero: number): string {
        return '$ ' + Numero.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
}
