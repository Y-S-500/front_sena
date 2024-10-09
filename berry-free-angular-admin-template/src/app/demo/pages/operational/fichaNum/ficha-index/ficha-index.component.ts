import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { BotonesComponent } from 'src/app/demo/general/botones/botones.component';
import { BreadcrumbComponent } from 'src/app/demo/general/breadcrumb/breadcrumb.component';
import { LANGUAGE_DATATABLE } from 'src/app/demo/general/interfaces/datatable.language';
import { FichaFormComponent } from '../ficha-form/ficha-form.component';
import { GeneralParameterService } from 'src/app/demo/general/general.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService } from 'src/app/demo/general/helper.service';
import { Subject } from 'rxjs';
import * as DataTables from 'datatables.net';
import { DatatableParameter } from 'src/app/demo/general/interfaces/datatable.parameters';

@Component({
  selector: 'app-ficha-index',
  standalone: true,
  imports: [BreadcrumbComponent, DataTablesModule, BotonesComponent,CommonModule],
  templateUrl: './ficha-index.component.html',
  styleUrl: './ficha-index.component.scss'
})
export class FichaIndexComponent {
  API_URL: any;
  title = "Listado de fichas";
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

  nuevo() {
    const modalRef = this.modalService.open(FichaFormComponent);

    modalRef.result.then((result) => {
      if (result) {
        console.log('Instrumento de Evaluación creado:', result);
        // Aquí puedes actualizar tu lista de items o realizar otra acción
      }
    }, (reason) => {
      console.log('Modal dismissed');
    });
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
      this.service.datatable("Categoria", data).subscribe(
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
