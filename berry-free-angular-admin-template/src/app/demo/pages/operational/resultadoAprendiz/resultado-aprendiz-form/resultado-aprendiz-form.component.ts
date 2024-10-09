import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ToastrModule } from 'ngx-toastr';
import { BotonesComponent } from 'src/app/demo/general/botones/botones.component';
import { FormsMessagesComponent } from 'src/app/demo/general/forms-messages/forms-messages.component';
import { GeneralParameterService } from 'src/app/demo/general/general.service';
import { HelperService, Messages, MessageType } from 'src/app/demo/general/helper.service';
import { DataAutoCompleteDto } from 'src/app/demo/general/interfaces/dataAutoCompleteDto';
import { DatatableParameter } from 'src/app/demo/general/interfaces/datatable.parameters';

@Component({
  selector: 'app-resultado-aprendiz-form',
  standalone: true,
  imports: [FormsMessagesComponent,ToastrModule,NgSelectModule,ReactiveFormsModule,AutocompleteLibModule, BotonesComponent, CommonModule,FormsModule],
  templateUrl: './resultado-aprendiz-form.component.html',
  styleUrl: './resultado-aprendiz-form.component.scss'
})
export class ResultadoAprendizFormComponent {
  frmResultadoAprendiz: FormGroup;
  statusForm: boolean = true
  id!: number;
  documento = "";
  isLoading: boolean = false;
  listCompetencia = signal<DataAutoCompleteDto[]>([]);
  botones = ['btn-guardar', 'btn-cancelar'];
  titulo = "";
  constructor(
    public routerActive: ActivatedRoute,
    private service: GeneralParameterService,
    private helperService: HelperService,
  ) {
    this.frmResultadoAprendiz = new FormGroup({
      Id: new FormControl(0),
      Codigo: new FormControl("", [Validators.required]),
      Nombre: new FormControl("", [Validators.required]),
      CompetenciaId: new FormControl(null, [Validators.required]),
      Activo: new FormControl(true)
    });
  }


  keyword = 'name';

  ngOnInit(): void {

   this.cargarCompetencias();
    if (this.id != undefined && this.id != null) {
      this.frmResultadoAprendiz.controls['Id'].setValue(this.id);
      this.service.getById("ResultadoAprendizaje", this.id).subscribe(l => {
        this.frmResultadoAprendiz.controls['Codigo'].setValue(l.data.codigo);
        this.frmResultadoAprendiz.controls['Nombre'].setValue(l.data.nombre);
        this.frmResultadoAprendiz.controls['CompetenciaId'].setValue(l.data.competenciaId);
        this.frmResultadoAprendiz.controls['Activo'].setValue(l.data.activo);
      })
    }
  }


  cargarCompetencias(): Promise<void> {
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
      this.service.datatable('Competencia', emptyDatatableParameter).subscribe(res => {
        const proyectos = res.data.map((item: any) => {
          return {
            id: item.id,
            name: item.nombre
          } as DataAutoCompleteDto;
        });
        this.listCompetencia.set(proyectos);  // Cambié 'empleados' a 'proyectos'
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

    if (this.frmResultadoAprendiz.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    this.helperService.showLoading();
    const data = {
      Id: this.id ?? 0,
      ...this.frmResultadoAprendiz.value,
    }

      this.service.save("ResultadoAprendizaje",this.id,data).subscribe(
        (response) => {
          this.frmResultadoAprendiz.controls["Id"].setValue(response.id);
          if (response.status) {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
            this.helperService.redirectApp('adashboard/resultadoAprendiz');
          }
        })
    }

    cancel() {
      this.helperService.redirectApp('adashboard/resultadoAprendiz');
    }

    selectEvent(item: any) {
      this.frmResultadoAprendiz.controls["CompetenciaId"].setValue(item.id);

    }

    onChangeSearch(val: string) {


    }

    onFocused(e: any) {
      // Aquí puedes manejar el evento de enfoque
      console.log('Input enfocado:', e);
    }
}
