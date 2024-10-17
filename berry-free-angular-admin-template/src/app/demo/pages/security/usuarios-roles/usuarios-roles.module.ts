import { Base } from "src/app/demo/general/base.module";

export interface UsuarioRol extends Base {
    usuarioId: number;
    usuario: string;
    rolId: number;
    rol: string;
}
