import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Globales {
    constructor() {
        
    }

    public Lista(Obj, pagina, cantidad) {
        return Obj.slice((pagina - 1) * cantidad, (pagina - 1) * cantidad + cantidad);
    }
}
