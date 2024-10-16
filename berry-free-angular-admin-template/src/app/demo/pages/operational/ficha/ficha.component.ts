import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { BotonesComponent } from 'src/app/demo/general/botones/botones.component';
import { FichaModalComponent } from './ficha-modal/ficha-modal.component';
import { GeneralParameterService } from 'src/app/demo/general/general.service';
import { HelperService, Messages, MessageType } from 'src/app/demo/general/helper.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DatatableParameter } from 'src/app/demo/general/interfaces/datatable.parameters';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { LANGUAGE_DATATABLE } from 'src/app/demo/general/interfaces/datatable.language';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from 'src/app/demo/general/breadcrumb/breadcrumb.component';
import { Api, Config } from 'datatables.net';

@Component({
  selector: 'app-ficha',
  standalone: true,
  imports: [BreadcrumbComponent, DataTablesModule, BotonesComponent, CommonModule],
  templateUrl: './ficha.component.html',
  styleUrl: './ficha.component.scss'
})
export class FichaComponent implements OnInit {
  title = "Listado de Aprendices";
  breadcrumb!: any[];
  botones: String[] = ['btn-plantilla-productos', 'btn-importar-productos', 'btn-nuevo'];

  public dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtOptions: Config = {};
  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  tableBotones: String[] = ['btn-modificar', 'btn-eliminar'];

  constructor(
    public service: GeneralParameterService,
    public helperService: HelperService,
    private modalService: NgbModal,

  ) {
  }

  ngOnInit(): void {
    this.cargarLista();
  }

  ngAfterViewInit() {
    this.dtTrigger.next(this.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  nuevo() {
    this.helperService.redirectApp("/dashboard/inventario/productos/crear");
  }

  cargarLista() {
    var dataTableParameter = new DatatableParameter(); dataTableParameter.pageNumber = ""; dataTableParameter.pageSize = ""; dataTableParameter.filter = ""; dataTableParameter.columnOrder = ""; dataTableParameter.directionOrder = ""; dataTableParameter.columnFilter = "";
    const that = this;
    this.dtOptions = {
      dom: 'Blfrtip',
      processing: true,
      ordering: true,
      paging: true,
      order: [0, "desc"],
      language: LANGUAGE_DATATABLE,
      ajax: (dataTablesParameters: any, callback: any) => {
        this.service.datatable("Ficha", dataTableParameter).subscribe((res) => {
          callback({
            recordsTotal: res.data.length,
            recordsFiltered: res.data.length,
            draw: dataTablesParameters.draw,
            data: res.data,
          });
        });
      },
      columns: [
        {
          title: 'Código',
          data: 'codigo',
          className: 'text-center',
        },
        {
          title: 'Nombre',
          data: 'nombre',
          className: 'text-center',
        },
        {
          title: 'Acciones',
          data: 'id',
          className: 'text-center',
          render: function (id: any) {
            const boton = that.botonesDatatable;
            return boton.botonesDropdown.nativeElement.outerHTML.split('$id').join(id);
          }
        },
      ],
      drawCallback: () => {
        $('.btn-dropdown-modificar')
          .off()
          .on('click', (event: any) => {
            // function
          });
        $('.btn-dropdown-eliminar')
          .off()
          .on('click', (event: any) => {
            this.deleteGeneric(event.currentTarget.dataset.id);
          });
      }
    };
  }

  importarMasivo() {
    let modal = this.modalService.open(FichaModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: true,
      centered: true,

    });
    modal.result.finally(() => {
      this.refrescarTabla();
    });
  }

  downloadFile() {
    let link = document.createElement("a");
    link.download = "Plantilla Importar Aprendices";
    link.href = "../../../../../assets/documentos/RegistroMasivo.xlsx";
    link.click();
    link.remove();
  }

  refrescarTabla() {
    if (typeof this.dtElement.dtInstance != 'undefined') {
      this.dtElement.dtInstance.then((dtInstance: Api) => {
        dtInstance.ajax.reload();
      });
    }
  }

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
            this.refrescarTabla();
          }
        },
        (error) => {
          this.helperService.showMessage(MessageType.ERROR, error);
        }
      )
    });
  }

}
