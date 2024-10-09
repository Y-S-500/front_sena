import { Component, ViewChild } from '@angular/core';
import { BotonesComponent } from 'src/app/demo/general/botones/botones.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FichaModalComponent } from './ficha-modal/ficha-modal.component';
import { GeneralParameterService } from 'src/app/demo/general/general.service';
import { HelperService, Messages, MessageType } from 'src/app/demo/general/helper.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

import { BreadcrumbComponent } from 'src/app/demo/general/breadcrumb/breadcrumb.component';
import { DatatableParameter } from 'src/app/demo/general/interfaces/datatable.parameters';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { LANGUAGE_DATATABLE } from 'src/app/demo/general/interfaces/datatable.language';
import * as DataTables from 'datatables.net'; // This may vary depending on your project setup



@Component({
  selector: 'app-ficha',
  standalone: true,
  imports: [SharedModule,BotonesComponent,BreadcrumbComponent],
  templateUrl: './ficha.component.html',
  styleUrl: './ficha.component.scss'
})
export class FichaComponent {
  title = "Listado de Aprendices";

  breadcrumb!: any[];
  botones: String[] = ['btn-plantilla-productos','btn-importar-productos', 'btn-nuevo'];

  public dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtOptions  = {};


  constructor(
    public service : GeneralParameterService,
    public helperService: HelperService,
    private modalService: NgbModal,

  ) {
    this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Inventario", icon: "fa-duotone fa-boxes-stacked" }, { name: "Productos", icon: "fa-duotone fa-shirt" }];
  }

  nuevo() {
    this.helperService.redirectApp("/dashboard/inventario/productos/crear");
  }


  cargarLista() {
    const that = this;
    this.dtOptions = {
      dom: 'lfrtip',
      processing: true,
      ordering: true,
      paging: true,
      order: [0, 'desc'],
      language: LANGUAGE_DATATABLE,
      // data: this.Aprendices, // Datos que mostrarán en la tabla
      columns: [
        {
          title: 'Nombres',
          data: 'Nombres',
          className: 'text-center',
        },
        {
          title: 'Apellidos',
          data: 'Apellidos',
          className: 'text-center',
        },
        {
          title: 'Email',
          data: 'Email',
          className: 'text-center',
        }
      ],
    };

    // if (this.Aprendices.length > 0) {
    //   this.uploadData = true;
    // }
  }

  importarMasivo() {
    let modal = this.modalService.open(FichaModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: true,
      centered: true,

    });
    modal.result.finally(() => {
      setTimeout(() => {
        // this.cargarLista();
      }, 200);
    });
  }

  downloadFile() {
    let link = document.createElement("a");
    link.download = "Plantilla Importar Aprendices";
    link.href = "../../../../../assets/documentos/RegistroMasivo.xlsx";
    link.click();
    link.remove();
  }


  // refrescarTabla() {
  //   if (typeof this.dtElement.dtInstance != 'undefined') {
  //     this.dtElement.dtInstance.then((dtInstance: DataTables.api) => {
  //       dtInstance.ajax.reload()
  //     });
  //   }
  // }
  deleteGeneric(id: any) {
    this.helperService.confirmDelete(() => {
      // Eliminar imagenes exixtente
      var data = new DatatableParameter(); data.pageNumber = ""; data.pageSize = ""; data.filter = ""; data.columnOrder = ""; data.directionOrder = ""; data.foreignKey = id; data.nameForeignKey = "TablaId";
      this.service.datatableKey("Archivo", data).subscribe((res) => {
        if (res.data.length > 0) {
          res.data.forEach((item: any) => {
            if (item.tabla == "Producto") {
              this.service.delete("Archivo", item.id).subscribe(() => { });
            }
          });
        }
      });

      this.service.delete("Producto", id).subscribe(
        (response) => {
          if (response.status) {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.DELETESUCCESS);
            // this.refrescarTabla();
          }
        },
        (error) => {
          this.helperService.showMessage(MessageType.ERROR, error);
        }
      )
    });
  }

}
