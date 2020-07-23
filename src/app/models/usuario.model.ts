export class Usuario {


    // Propiedades Obligatorias
    constructor(
        public nombre: string,
        public apellido: string,
        public email: string,
        public contrasena: string,
        public rol?: 'ADMIN_ROLE' | 'USER_ROLE',
        public idUsuario?: string,
        public estado?: boolean
    ){}
}