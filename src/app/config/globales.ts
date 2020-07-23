import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Globales {
    private _preloader = document.getElementById('spinner');
    constructor() {

    }

    public Lista(Obj, pagina, cantidad) {
        return Obj.slice((pagina - 1) * cantidad, (pagina - 1) * cantidad + cantidad);
    }

    mostrarPreloader(){
        this._preloader.classList.add('mostrarPreloader');
    }

    ocultarPreloader(){
        this._preloader.classList.add('ocultarPreloader');
    }
}
