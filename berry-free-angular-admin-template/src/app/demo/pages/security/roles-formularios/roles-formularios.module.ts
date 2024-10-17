import { Base } from "src/app/demo/general/base.module";

export interface RolFormulario extends Base {
    formularioId: number;
    formulario: string;
    rolId: number;
    rol: string;
}
