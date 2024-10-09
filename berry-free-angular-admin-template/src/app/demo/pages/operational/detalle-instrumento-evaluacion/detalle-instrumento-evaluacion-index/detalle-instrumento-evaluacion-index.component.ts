import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import { Subject } from 'rxjs';
import { BotonesComponent } from 'src/app/demo/general/botones/botones.component';
import { FormsMessagesComponent } from 'src/app/demo/general/forms-messages/forms-messages.component';
import { GeneralParameterService } from 'src/app/demo/general/general.service';
import { HelperService, Messages, MessageType } from 'src/app/demo/general/helper.service';
import { LANGUAGE_DATATABLE } from 'src/app/demo/general/interfaces/datatable.language';
import { DatatableParameter } from 'src/app/demo/general/interfaces/datatable.parameters';
import * as DataTables from 'datatables.net';
import { BreadcrumbComponent } from 'src/app/demo/general/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-detalle-instrumento-evaluacion-index',
  standalone: true,
  imports: [BreadcrumbComponent, DataTablesModule, BotonesComponent,CommonModule],
  templateUrl: './detalle-instrumento-evaluacion-index.component.html',
  styleUrl: './detalle-instrumento-evaluacion-index.component.scss'
})
export class DetalleInstrumentoEvaluacionIndexComponent {
  API_URL: any;
  title = "Listado instrumentos de evaluacion";
  breadcrumb!: any[];
  botones: String[] = ['btn-nuevo'];
  listActividad = [];


  public dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtOptions: DataTables.Config  = {};



  constructor(
    private service: GeneralParameterService,
    private modalService: NgbModal,
    private helperService: HelperService
  ) {
    // this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Seguridad", icon: "fa-duotone fa-lock" }, { name: "Personas", icon: "fa-duotone fa-user" }];
  }
  ngOnInit(): void {
      this.cargarLista();
  }

  nuevo(){
    this.helperService.redirectApp("adashboard/detalleInstrumentoEvaluacion/nuevo")
  }

  cargarLista() {
    this.data().then((data) => {
      this.dtOptions = {
        dom: 'lfrtip',
        processing: true,
        ordering: true,
        paging: true,
        order: [0, 'desc'],
        language: LANGUAGE_DATATABLE,
        data: data,  // Usar los datos obtenidos
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

      if (this.listActividad.length > 0) {
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
      this.service.datatable("DetalleInstrumentoEvaluacion", data).subscribe(
        (datos) => {
          resolve(datos);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }



  deleteGeneric(id:number){}

  updateGeneric(id:number){}
}
