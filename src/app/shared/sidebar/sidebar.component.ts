import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarService, UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit ,OnDestroy{

  usuario: Usuario;
  routerSuscription: Subscription;

  constructor(
    public _sidebar: SidebarService,
    public _usuarioService: UsuarioService,
    private router: Router, 
    private route: ActivatedRoute
  ) {
    this.usuario = this._usuarioService.usuario;
    this.routerSuscription = this.router.events
    .pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data),
    )
    .subscribe((d) => {
      if (window.innerWidth < 768 && document.getElementsByTagName('body')[0].className.indexOf('show-sidebar') > 0) {
        // tslint:disable-next-line: no-string-literal
        document.getElementsByClassName('nav-toggler')[0]['click']();
      }
    });
   }
   
  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.routerSuscription.unsubscribe();
  }

}