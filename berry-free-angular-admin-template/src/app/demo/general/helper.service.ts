import { Location, formatNumber } from "@angular/common";
import { Inject, Injectable, LOCALE_ID } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import Swal from 'sweetalert2';
import { GeneralParameterService } from "./general.service";

@Injectable({
    providedIn: 'root'
})
export class HelperService {
    empleadoId = 0;

    constructor(
        private router: Router, public _location: Location,
        private service : GeneralParameterService,
        private _toast: ToastrService, private _spinner: NgxSpinnerService,
        @Inject(LOCALE_ID) private locale: string
    ) { }



    // combertir bytes a img
    convertBytesToImage(bytes: Uint8Array): string {
        // Crear un Blob a partir del arreglo de bytes
        const blob = new Blob([bytes], { type: 'image/png' }); // Ajusta el tipo MIME según el tipo de imagen
        // Crear una URL a partir del Blob
        return URL.createObjectURL(blob);
    }


    //input con la zona horario actual
    getLocalDateTime(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = ('0' + (now.getMonth() + 1)).slice(-2);
        const day = ('0' + now.getDate()).slice(-2);
        const hours = ('0' + now.getHours()).slice(-2);
        const minutes = ('0' + now.getMinutes()).slice(-2);
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }



    // format Jueves 05/09/2024

    getFormatDayDate(item: any): string {
        const date = new Date(item);
        const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        const weekdayName = weekdays[date.getDay()];
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();

        const formattedDate = `${weekdayName} ${day}/${month}/${year}`;

        return formattedDate;
    }



    formato24Horas(value: string): string {
        if (!value) return value;

        const [hora, minuto, segundo] = value.split(':').map(Number);
        const amPm = hora >= 12 ? 'PM' : 'AM';
        const hora12 = hora % 12 || 12; // convierte "0" o "12" a "12"
        const minutosFormateados = minuto.toString().padStart(2, '0');
        return `${hora12}:${minutosFormateados} ${amPm}`;
    }

    public formaterNumber(number: number) {
        return formatNumber(number, this.locale, '1.0-0');
    }

    formatearNumero(num: string, separdorDecimal: string, separador: string, cantDecimales: number, peso: boolean = true, aproximar: boolean = true) {
        if (aproximar) {
            num = parseFloat(num).toFixed(cantDecimales);
        }
        if (!isNaN(Number(num))) {
            num += '';
            const splitStr = num.split('.');
            let splitLeft = splitStr[0];
            const splitRight = splitStr.length > 1 ? separdorDecimal + splitStr[1].slice(0, cantDecimales) : '';
            const regx = /(\d+)(\d{3})/;

            if (separador != null && separador.trim().length > 0) {
                while (regx.test(splitLeft)) {
                    splitLeft = splitLeft.replace(regx, '$1' + separador + '$2');
                }
            }

            if (peso) {
                return '$ ' + splitLeft + splitRight;
            } else {
                return splitLeft + splitRight;
            }
        }
        return '';
    }

    formatearNumeroDB(numero: string) {
        numero = numero.replace(".", "");
        numero = numero.replace(",", ".");
        numero = numero.replace("$", "");
        numero = numero.replace("%", "");
        numero = numero.replace(" ", "");
        return numero;
    }

    redirectApp(url: String) {
        this.router.navigate([url]);
    }

    onClickBack() {
        this._location.back();
    }

    confirmDelete(callback: any) {
        Swal.fire({
            title: '¿Está seguro de realizar esta acción?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F8E12E',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminelo!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                callback();
            }
        })
    }

    confirmUpdate(callback: any) {
        Swal.fire({
            title: '¿Está seguro de realizar esta acción?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#F8E12E',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Editar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                callback();
            }
        })
    }

    viewImage(extesion: any, callbackYes: any, callbackNot: any) {
        // if (extesion === 'png'){
        Swal.fire({
            title: '¿Deseas ver el archivo antes de descargar?',
            // text: "Esta acción no se puede deshacer",
            icon: 'question',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonColor: '#F8E12E',
            cancelButtonColor: '#3085d6',
            denyButtonColor: '#d33',
            confirmButtonText: 'Si , Ver!',
            cancelButtonText: 'Cancelar',
            denyButtonText: `No , Descargar`,
        }).then((result) => {
            if (result.isConfirmed) {
                callbackYes();
            }
            if (result.isDenied) {
                callbackNot();
            }

        })
        // }else {
        //     callbackNot();
        // }
    }

    showDesicionCustom(title: any, message: any, type: any, callback: any) {
        Swal.fire({
            title: title,
            text: message,
            icon: type,
            showCancelButton: true,
            confirmButtonColor: '#F8E12E',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                callback();
            }
        })
    }

    showMessage(type: string, message: string, title: string = "Mensaje del sistema") {
        switch (type) {
            case MessageType.ERROR:
                this._toast.error(message, title);
                break;
            case MessageType.SUCCESS:
                this._toast.success(message, title);
                break;
            case MessageType.WARNING:
                this._toast.warning(message, title)
                break;
            case MessageType.PROGRESS:
                this._toast.info(message, title)
                break;
            default:
                break;
        }
    }

    showLoading() {
        this._spinner.show()
    }

    hideLoading() {
        setTimeout(() => {
            this._spinner.hide();
        }, 500);
    }

    convertDateUTCToDMA(date: any) {
        let dateSplit = date.split('T')[0].split('-');
        return `${dateSplit[2]}/${dateSplit[1]}/${dateSplit[0]}`;
    }

    convertDateTime(date: any) {
        const dateObj = new Date(date);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();

        let hours = dateObj.getHours();
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    convertDateTimeFormate12h(date: any) {
        const dateObj = new Date(date);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();

        let hours = dateObj.getHours();
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strHours = String(hours).padStart(2, '0');

        return `${day}/${month}/${year} ${strHours}:${minutes}:${seconds} ${ampm}`;
    }

    getTime(date: any) {
        var time = null;
        if (date != null) {
            const dateObj = new Date(date);
            var hours = dateObj.getHours();
            var minutes = String(dateObj.getMinutes()).padStart(2, '0');
            //var seconds = String(dateObj?.getSeconds() ?? 0).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // la hora '0' debe ser '12'
            time = `${hours}:${minutes} ${ampm}`
        }

        return time;
    }

    traduccionDatatable() {
        return {
            "decimal": ",",
            "thousands": ".",
            "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "infoPostFix": "",
            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
            "loadingRecords": "Cargando...",
            "lengthMenu": "Mostrar _MENU_  registros por página",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "processing": "Procesando...",
            "search": "Buscar:",
            "searchPlaceholder": "",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningún dato disponible en esta tabla",
            "aria": {
                "sortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sortDescending": ": Activar para ordenar la columna de manera descendente"
            },
            //only works for built-in buttons, not for custom buttons
            "buttons": {
                "create": "Nuevo",
                "edit": "Cambiar",
                "remove": "Borrar",
                "copy": "Copiar",
                "csv": "fichero CSV",
                "excel": "tabla Excel",
                "pdf": "documento PDF",
                "print": "Imprimir",
                "colvis": "Visibilidad columnas",
                "collection": "Colección",
                "upload": "Seleccione fichero...."
            },
            "select": {
                "rows": {
                    _: '%d filas seleccionadas',
                    0: 'clic fila para seleccionar',
                    1: 'una fila seleccionada'
                }
            }
        }
    }

    public capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }



    public expresionRegularMask(valor: any, exp: any): RegExp[] {
        const nameMask: RegExp[] = [];
        if (exp != null) {
            for (let i = 0; i <= 500; i++) {
                nameMask.push(exp);
            }
        }
        return nameMask;
    }

    public expresionRegularMaskNumAct(valor: any, exp: any, cantidad: any): RegExp[] {
        const nameMask: RegExp[] = [];
        if (exp != null) {
            for (let i = 1; i <= cantidad; i++) {
                nameMask.push(exp);
            }
        }
        return nameMask;
    }

    public mascaraNombre(valor: any, exp: any, cantidad: any): RegExp[] {
        const nameMask: RegExp[] = [];
        if (exp != null) {
            for (let i = 1; i <= cantidad; i++) {
                nameMask.push(exp);
            }
        }
        return nameMask;
    }

    public mascaraNombreCGR(rawValue: any, control: any): RegExp[] {
        rawValue = rawValue.toUpperCase();
        control.setValue(rawValue);
        const maskStr = /[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ´]/;
        const strLength = 115;
        const nombreCGR: RegExp[] = [];
        for (let i = 1; i <= strLength; i++) {
            nombreCGR.push(maskStr);
        }
        return nombreCGR;
    }

    codigoMaskExtendido(rawValue: any, control: any): RegExp[] {

        rawValue = rawValue ? rawValue.toUpperCase() : null;
        control.setValue(rawValue);
        const maskStr = /[A-Za-z0-9]/;
        const strLength = 20;
        const codigoMask: RegExp[] = [];
        for (let i = 1; i <= strLength; i++) {
            codigoMask.push(maskStr);
        }
        return codigoMask;
    }

    orden(rawValue: any, control: any): RegExp[] {
        rawValue = rawValue ? rawValue.toUpperCase() : null;
        control.setValue(rawValue);
        const maskStr = /^[0-9]+$/;
        const strLength = 2;
        const codigoMask: RegExp[] = [];
        for (let i = 1; i <= strLength; i++) {
            codigoMask.push(maskStr);
        }
        return codigoMask;
    }

    public mascaraDescripcion(valor: any) {
        const arregloDescripcion: any = [];
        let cant: any = 0;
        let arregloLength: any;
        const descripcion = valor.split(' ');
        descripcion.forEach((element: any) => {
            if (element != '') {
                arregloDescripcion.push(element);
                cant += element.length;
            }

        });
        arregloLength = arregloDescripcion.length;
        return { 'cantPalabra': arregloLength, 'cantCaracteres': cant };
    }

    public downloadFile(data: any) {
        const linkSource = `${data.archivo}`;
        const downloadLink = document.createElement("a");
        const fileName = `${data.nombre}`;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click()
    }

    showMessageError(response: any) {
        if (response && response.status == 500) {
            this.showMessage(MessageType.ERROR, response.error.message);
        } else {
            this.showMessage(MessageType.ERROR, response.message);
        }
    }

    public getEnum(endPoint: string, bindValue: string, bindLabel: string): Promise<any> {
      var lstDataSelect: any[] = [];

      return new Promise((resolve) => {
          this.service.getEnum(endPoint).subscribe((res) => {
              res.data.forEach((item: any) => {
                  if (bindValue == "" && bindLabel == "") {
                      lstDataSelect.push(
                          {
                              id: item,
                              nombre: item,
                          }
                      );
                  } else {
                      lstDataSelect.push(
                          {
                              id: item[bindValue],
                              nombre: item[bindLabel],
                          }
                      );
                  }
              });

              resolve(lstDataSelect);
          });
      });
  }
}

export const MessageType = {
    SUCCESS: "S",
    WARNING: "W",
    ERROR: "E",
    PROGRESS: "P"
}







export const Messages = {
    SAVESUCCESS: "Registro guardado",
    SAVEERROR: "Error al guardar",
    UPDATESUCCESS: "Registro actualizado",
    UPDATEERROR: "Error al actualizar",
    DELETESUCCESS: "Registro eliminado",
    DELETEERROR: "Error al eliminar",
    EMPTYFIELD: "Faltan campos por llenar",
    INVALIDUSER: "Usuario o contraseña incorrectos",
    INVALIDOPERATION: "Operación no permitida",
    INVALIDPASSWORD: "Contraseñas no coinciden",
    EXPIREDSESION: "Su sesion ha expirado, ingrese nuevamente",
    DELETEFACTURE: "No se puede eliminar una factura aprobada",
    UPDATEFACTURE: "No se puede editar una factura aprobada",
    INVALIDFILE: "Archivo no permitido",
    SAVEFILE: "Archivo cargado exitosamente",
    PROGRESS: "Procesando Datos, Espere por favor...",



}
