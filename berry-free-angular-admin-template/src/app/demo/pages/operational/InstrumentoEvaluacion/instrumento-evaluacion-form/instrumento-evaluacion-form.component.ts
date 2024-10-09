import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ToastrModule } from 'ngx-toastr';
import { BotonesComponent } from 'src/app/demo/general/botones/botones.component';
import { FormsMessagesComponent } from 'src/app/demo/general/forms-messages/forms-messages.component';
import { GeneralParameterService } from 'src/app/demo/general/general.service';
import { HelperService, Messages, MessageType } from 'src/app/demo/general/helper.service';
import { DataAutoCompleteDto } from 'src/app/demo/general/interfaces/dataAutoCompleteDto';
import { DatatableParameter } from 'src/app/demo/general/interfaces/datatable.parameters';

@Component({
  selector: 'app-instrumento-evaluacion-form',
  standalone: true,
  imports: [FormsMessagesComponent,ToastrModule,NgSelectModule,ReactiveFormsModule,AutocompleteLibModule, BotonesComponent, CommonModule,FormsModule],
  templateUrl: './instrumento-evaluacion-form.component.html',
  styleUrl: './instrumento-evaluacion-form.component.scss'
})
export class InstrumentoEvaluacionFormComponent {
  frmDetalleEvaluacion: FormGroup;
  statusForm: boolean = true
  id!: number;
  documento = "";
  botones = ['btn-guardar', 'btn-cancelar'];
  titulo = "";
  listItems = signal<DataAutoCompleteDto[]>([]);
  listAprendiz = signal<DataAutoCompleteDto[]>([]);
  listActividad = signal<DataAutoCompleteDto[]>([]);
  listInstructor = signal<DataAutoCompleteDto[]>([]);


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
      InstructorId: new FormControl(null, [Validators.required]),
      AprendizId: new FormControl(0),
      ActividadId: new FormControl(null, [Validators.required]),

      Activo: new FormControl(true)
    });
  }

  ngOnInit(): void {
    this.cargarItems();
    this.cargarAprendiz();
    this.cargarActividad();
    this.cargarInstructores();

    if (this.id != undefined && this.id != null) {
      this.frmDetalleEvaluacion.controls['Id'].setValue(this.id);
      this.service.getById("InstrumentoEvaluacion", this.id).subscribe(l => {
        this.frmDetalleEvaluacion.controls['Cumple'].setValue(l.data.cumple);
        this.frmDetalleEvaluacion.controls['FechaCalificacion'].setValue(l.data.fechaCalificacion);
        this.frmDetalleEvaluacion.controls['Observacion'].setValue(l.data.observacion);
        this.frmDetalleEvaluacion.controls['InstructorId'].setValue(l.data.instructorId);
        this.frmDetalleEvaluacion.controls['ActividadId'].setValue(l.data.actividadId);
        this.frmDetalleEvaluacion.controls['AprendizId'].setValue(l.data.aprendizId);
        this.frmDetalleEvaluacion.controls['Activo'].setValue(l.data.activo);
      })
    }
  }

  cargarAprendiz(): Promise<void> {
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
      this.service.datatable('Aperndiz', emptyDatatableParameter).subscribe(res => {
        const proyectos = res.data.map((item: any) => {
          return {
            id: item.id,
            name: item.persona
          } as DataAutoCompleteDto;
        });
        this.listAprendiz.set(proyectos);  // Cambié 'empleados' a 'proyectos'
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

  cargarActividad(): Promise<void>{
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
      this.service.datatable('Actividad', emptyDatatableParameter).subscribe(res => {
        const actividad = res.data.map((item: any) => {
          return {
            id: item.id,
            name: item.nombre
          } as DataAutoCompleteDto;
        });
        this.listActividad.set(actividad);  // Cambié 'empleados' a 'proyectos'
        this.isLoading = false;
        resolve();
      }, error => {
        console.error('Error loading projects', error);
        this.isLoading = false;
        reject(error);
      });
    });
  }
  cargarInstructores(): Promise<void>{
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
      this.service.datatable('Instructor', emptyDatatableParameter).subscribe(res => {
        const intructor = res.data.map((item: any) => {
          return {
            id: item.id,
            name: item.persona
          } as DataAutoCompleteDto;
        });
        this.listInstructor.set(intructor);  // Cambié 'empleados' a 'proyectos'
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

      this.service.save("InstrumentoEvaluacion",this.id,data).subscribe(
        (response) => {
          this.frmDetalleEvaluacion.controls["Id"].setValue(response.id);
          if (response.status) {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
            this.helperService.redirectApp('adashboard/instrumentoEvaluacion');
          }
        })
    }

    cancel() {
      this.helperService.redirectApp('adashboard/instrumentoEvaluacion');
    }

    selectEvent(item: any,tipo : string) {
      switch (tipo) {
        case 'instructor':
          this.frmDetalleEvaluacion.controls["InstructorId"].setValue(item.id);
          break;
        case 'actividad':
          this.frmDetalleEvaluacion.controls["ActividadId"].setValue(item.id);
          break;
          case 'aprendiz':
            this.frmDetalleEvaluacion.controls["AprendizId"].setValue(item.id);
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
