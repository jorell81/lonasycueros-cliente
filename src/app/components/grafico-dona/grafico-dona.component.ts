import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html',
  styles: []
})
export class GraficoDonaComponent implements OnInit {

  @Input() public data: number[] = [];
  @Input() public labels: string[] = [];
  @Input() public chartType: string = '';
  @Input() leyenda: string = '';



  constructor() { }

  ngOnInit() {
    //console.log(this.data);
  }

}
