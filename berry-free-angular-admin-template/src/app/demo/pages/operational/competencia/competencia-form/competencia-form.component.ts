import { NgSelectModule } from '@ng-select/ng-select';
import { DataAutoCompleteDto } from './../../../../general/interfaces/dataAutoCompleteDto';
import { Component, Signal, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GeneralParameterService } from 'src/app/demo/general/general.service';
import { HelperService, Messages, MessageType } from 'src/app/demo/general/helper.service';
import { FormsMessagesComponent } from "../../../../general/forms-messages/forms-messages.component";
import { BotonesComponent } from "../../../../general/botones/botones.component";
import { CommonModule } from '@angular/common';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DatatableParameter } from 'src/app/demo/general/interfaces/datatable.parameters';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-competencia-form',
  standalone: true,
  imports: [FormsMessagesComponent,ToastrModule,NgSelectModule,ReactiveFormsModule,AutocompleteLibModule, BotonesComponent, CommonModule,FormsModule],
  templateUrl: './competencia-form.component.html',
  styleUrl: './competencia-form.component.css'
})
export class CompetenciaFormComponent {
  frmCompetencia: FormGroup;
  statusForm: boolean = true
  id!: number;
  documento = "";
  isLoading: boolean = false;
  listProyectos = signal<DataAutoCompleteDto[]>([]);
  botones = ['btn-guardar', 'btn-cancelar'];
  titulo = "";
  listTipo : any[]= [];
  listFase : any[]= [];
  constructor(
    public routerActive: ActivatedRoute,
    private service: GeneralParameterService,
    private helperService: HelperService,
  ) {
    this.frmCompetencia = new FormGroup({
      Id: new FormControl(0),
      Codigo: new FormControl("", [Validators.required]),
      Nombre: new FormControl(null, [Validators.required]),
      Fase: new FormControl(null, [Validators.required]),
      Tipo: new FormControl("", [Validators.required]),
      ProyectoId:  new FormControl("", [Validators.required]),
      Activo: new FormControl(true)
    });
  }


  keyword = 'name';

  ngOnInit(): void {
    this.CargarFase();
    this.CargarTipoActividad();
   this.cargarProyectos();
    if (this.id != undefined && this.id != null) {
      this.frmCompetencia.controls['Id'].setValue(this.id);
      this.service.getById("Competecia", this.id).subscribe(l => {
        this.frmCompetencia.controls['Codigo'].setValue(l.data.codigo);
        this.frmCompetencia.controls['Nombre'].setValue(l.data.nombre);
        this.frmCompetencia.controls['Fase'].setValue(l.data.fase);
        this.frmCompetencia.controls['Tipo'].setValue(l.data.tipo);
        this.frmCompetencia.controls['ProyectoId'].setValue(l.data.proyectoId);
        this.frmCompetencia.controls['Activo'].setValue(l.data.activo);
      })
    }
  }

  CargarTipoActividad(){
    this.CargarEnum('TipoActividad');
  }

  CargarFase(){
    this.CargarEnum('FaseCometencia');
  }

  CargarEnum( parametro: string) {
    this.helperService.getEnum(parametro, "description", "description").then((res) => {
      if (parametro == 'TipoActividad') {
        this.listTipo = res;
      }else  if (parametro == 'FaseCometencia') {
        this.listFase = res;
      }
    });

}



  cargarProyectos(): Promise<void> {
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
      this.service.datatable('Proyecto', emptyDatatableParameter).subscribe(res => {
        const proyectos = res.data.map((item: any) => {
          return {
            id: item.id,
            name: item.nombre
          } as DataAutoCompleteDto;
        });
        this.listProyectos.set(proyectos);  // Cambié 'empleados' a 'proyectos'
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

    if (this.frmCompetencia.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    this.helperService.showLoading();
    const data = {
      Id: this.id ?? 0,
      ...this.frmCompetencia.value,
    }

      this.service.save("Competencia",this.id,data).subscribe(
        (response) => {
          this.frmCompetencia.controls["Id"].setValue(response.id);
          if (response.status) {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
            this.helperService.redirectApp('adashboard/competencia');
          }
        })
    }

    cancel() {
      this.helperService.redirectApp('adashboard/competencia');
    }

    selectEvent(item: any) {
      this.frmCompetencia.controls["ProyectoId"].setValue(item.id);

    }

    onChangeSearch(val: string) {


    }

    onFocused(e: any) {
      // Aquí puedes manejar el evento de enfoque
      console.log('Input enfocado:', e);
    }
}
