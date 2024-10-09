import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { BotonesComponent } from 'src/app/demo/general/botones/botones.component';
import { FormsMessagesComponent } from 'src/app/demo/general/forms-messages/forms-messages.component';
import { GeneralParameterService } from 'src/app/demo/general/general.service';
import { HelperService, Messages, MessageType } from 'src/app/demo/general/helper.service';
import { DataAutoCompleteDto } from 'src/app/demo/general/interfaces/dataAutoCompleteDto';
import { DatatableParameter } from 'src/app/demo/general/interfaces/datatable.parameters';

@Component({
  selector: 'app-detalle-instrumento-evaluacion-form',
  standalone: true,
  imports: [FormsMessagesComponent,ToastrModule,NgSelectModule,ReactiveFormsModule,AutocompleteLibModule, BotonesComponent, CommonModule,FormsModule],
  templateUrl: './detalle-instrumento-evaluacion-form.component.html',
  styleUrl: './detalle-instrumento-evaluacion-form.component.scss'
})
export class DetalleInstrumentoEvaluacionFormComponent {
  frmDetalleEvaluacion: FormGroup;
  statusForm: boolean = true
  id!: number;
  documento = "";
  botones = ['btn-guardar', 'btn-cancelar'];
  titulo = "";
  listItems = signal<DataAutoCompleteDto[]>([]);
  listInstrumentoEvaluacion = signal<DataAutoCompleteDto[]>([]);

  isLoading: boolean = false;
  keyword = 'name';
  keyword2 = 'name';



  constructor(
    public routerActive: ActivatedRoute,
    private service: GeneralParameterService,
    private helperService: HelperService,
  ) {
    this.frmDetalleEvaluacion = new FormGroup({
      Id: new FormControl(0),
      FechaCalificacion: new FormControl("", [Validators.required]),
      Cumple: new FormControl(false, [Validators.required]),
      Observacion: new FormControl(null, [Validators.required]),
      ItemId: new FormControl(null, [Validators.required]),
      InstrumentoEvaluacionId: new FormControl(null, [Validators.required]),
      Activo: new FormControl(true)
    });
  }

  ngOnInit(): void {
    this.cargarItems();
    this.cargarIstrumentoEvaluacion();
    if (this.id != undefined && this.id != null) {
      this.frmDetalleEvaluacion.controls['Id'].setValue(this.id);
      this.service.getById("Persona", this.id).subscribe(l => {
        this.frmDetalleEvaluacion.controls['Documento'].setValue(l.data.nombre);
        this.frmDetalleEvaluacion.controls['TipoDocumento'].setValue(l.data.fechaInicio);
        this.frmDetalleEvaluacion.controls['PrimerNombre'].setValue(l.data.fechaFin);
        this.frmDetalleEvaluacion.controls['SegundoNombre'].setValue(l.data.duracion);
        this.frmDetalleEvaluacion.controls['Activo'].setValue(l.data.activo);
      })
    }
  }

  cargarIstrumentoEvaluacion(): Promise<void> {
    this.isLoading = true;
    const emptyDatatableParameter: DatatableParameter = {
      pageNumber: '',
      pageSize: '',
      filter: '',
      extra: "",
      foreignKey: "",
      foreignKeyExtra: "",
      nameForeignKey: '',
      columnOrder: '',
      columnFilter: '',
      directionOrder: '',
      parametersTable: '',
      apiUrl: '',
      fechaInicio: '',
      fechaFin: ''
    };

    return new Promise((resolve, reject) => {
      this.service.datatable('InstrumentoEvaluacion', emptyDatatableParameter).subscribe(res => {
        const proyectos = res.data.map((item: any) => {
          return {
            id: item.id,
            name: item.actividad
          } as DataAutoCompleteDto;
        });
        this.listInstrumentoEvaluacion.set(proyectos);  // Cambié 'empleados' a 'proyectos'
        this.isLoading = false;
        resolve();
      }, error => {
        console.error('Error loading projects', error);
        this.isLoading = false;
        reject(error);
      });
    });
  }

  cargarItems(): Promise<void> {
    this.isLoading = true;
    const emptyDatatableParameter: DatatableParameter = {
      pageNumber: '',
      pageSize: '',
      filter: '',
      extra: "",
      foreignKey: "",
      foreignKeyExtra: "",
      nameForeignKey: '',
      columnOrder: '',
      columnFilter: '',
      directionOrder: '',
      parametersTable: '',
      apiUrl: '',
      fechaInicio: '',
      fechaFin: ''
    };

    return new Promise((resolve, reject) => {
      this.service.datatable('Item', emptyDatatableParameter).subscribe(res => {
        const proyectos = res.data.map((item: any) => {
          return {
            id: item.id,
            name: item.titulo
          } as DataAutoCompleteDto;
        });
        this.listItems.set(proyectos);  // Cambié 'empleados' a 'proyectos'
        this.isLoading = false;
        resolve();
      }, error => {
        console.error('Error loading projects', error);
        this.isLoading = false;
        reject(error);
      });
    });
  }


  save() {
    console.log("asdas");

    if (this.frmDetalleEvaluacion.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    this.helperService.showLoading();
    const data = {
      Id: this.id ?? 0,
      ...this.frmDetalleEvaluacion.value,
    }

      this.service.save("DetalleInstrumentoEvaluacion",this.id,data).subscribe(
        (response) => {
          this.frmDetalleEvaluacion.controls["Id"].setValue(response.id);
          if (response.status) {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
            this.helperService.redirectApp('adashboard/detalleInstrumentoEvaluacion');
          }
        })
    }

    cancel() {
      this.helperService.redirectApp('adashboard/detalleInstrumentoEvaluacion');
    }

    selectEvent(item: any,tipo : string) {
      switch (tipo) {
        case 'instrumento':
          this.frmDetalleEvaluacion.controls["InstrumentoEvaluacionId"].setValue(item.id);
          break;
        case 'item':
          this.frmDetalleEvaluacion.controls["ItemId"].setValue(item.id);
          break;

        default:
          break;
      }

    }

    onChangeSearch(val: string) {


    }

    onFocused(e: any) {
      // Aquí puedes manejar el evento de enfoque
      console.log('Input enfocado:', e);
    }
}
