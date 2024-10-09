import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { GeneralParameterService } from 'src/app/demo/general/general.service';
import { HelperService, Messages, MessageType } from 'src/app/demo/general/helper.service';
import { LANGUAGE_DATATABLE } from 'src/app/demo/general/interfaces/datatable.language';
import { DatatableParameter } from 'src/app/demo/general/interfaces/datatable.parameters';
import * as DataTables from 'datatables.net';
import { BotonesComponent } from "../../../../general/botones/botones.component";

@Component({
  selector: 'app-resultado-aprendiz-index',
  standalone: true,
  imports: [BotonesComponent,DataTablesModule],
  templateUrl: './resultado-aprendiz-index.component.html',
  styleUrl: './resultado-aprendiz-index.component.scss'
})
export class ResultadoAprendizIndexComponent {
  title = "Listado de resultadoAprendiz";
  botones: String[] = ['btn-nuevo'];
  lisProyecto = [];
  public dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtOptions: DataTables.Config = {};

  constructor(
    private service: GeneralParameterService,
    private modalService: NgbModal,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.cargarLista();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  nuevo() {
    this.helperService.redirectApp("adashboard/resultadoAprendiz/nuevo");
  }

  cargarLista() {
    this.data().then((data) => {
      this.lisProyecto = data.data;
      console.log(this.lisProyecto);

      // Check if there are items to display
      if (this.lisProyecto.length > 0) {
        console.log("ingresado");
        console.log(this.lisProyecto);

        // Configure DataTable options
        this.dtOptions = {
          dom: 'lfrtip',
          processing: true,
          ordering: true,
          paging: true,
          order: [0, 'desc'],
          language: LANGUAGE_DATATABLE,
          data: this.lisProyecto,
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
              render: (id: any) => {
                return `
                  <button type="button" title="Editar" class="btn btn-sm text-secondary btn-dropdown-modificar" data-id="${id}"><i class="fa-duotone fa-pen-to-square" data-id="${id}"></i> Editar</button>
                  <button type="button" title="Eliminar" class="btn btn-sm text-secondary btn-dropdown-eliminar" data-id="${id}"><i class="fa-duotone fa-trash-can" data-id="${id}"></i> Eliminar</button>
                `;
              }
            }
          ],
          drawCallback: () => {
            $('.btn-dropdown-modificar')
              .off()
              .on('click', (event: any) => {
                this.editar(event.currentTarget.dataset.id);
              });

            $('.btn-dropdown-eliminar')
              .off()
              .on('click', (event: any) => {
                this.eliminar(event.currentTarget.dataset.id);
              });
          },
        };

        // Check if DataTable is already initialized
        if ($.fn.DataTable.isDataTable('#DataTables_Table_1')) {
          // Destroy existing DataTable instance
          $('#DataTables_Table_1').DataTable().clear().destroy();
        }

        // Trigger DataTable render with options
        this.dtTrigger.next(this.dtOptions);
      }
    }).catch((error) => {
      console.error('Error al cargar los datos', error);
    });
  }


  data(): Promise<any> {
    const data = new DatatableParameter();
    data.pageNumber = "";
    data.pageSize = "";
    data.filter = "";
    data.columnOrder = "";
    data.directionOrder = "";

    return new Promise((resolve, reject) => {
      this.service.datatable("ResultadoAprendizaje", data).subscribe(
        (datos) => {
          resolve(datos);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  eliminar(id: number) {
    this.helperService.confirmDelete(() => {
      this.service.delete("ResultadoAprendizaje", id).subscribe(
        (response) => {
          if (response.status) {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.DELETESUCCESS);
            //this.redrawTable(); // Refresh the table after deletion
          }
        },
        (error) => {
          this.helperService.showMessage(MessageType.WARNING, error);
        }
      );
    });
  }

  editar(id: number) {
    console.log(id);

    this.helperService.redirectApp(`adashboard/resultadoAprendizeditar/${id}`);

  }

}
