import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-instructor-form',
  standalone: true,
  imports: [FormsMessagesComponent,ToastrModule,NgSelectModule,ReactiveFormsModule,AutocompleteLibModule, BotonesComponent, CommonModule,FormsModule],
  templateUrl: './instructor-form.component.html',
  styleUrl: './instructor-form.component.scss'
})
export class InstructorFormComponent {
  frmItem: FormGroup;
  tipos: string[] = ['Cuantitativo', 'Cualitativo'];
  isLoading: boolean = false;
  Id!:number;
  listPersona = signal<DataAutoCompleteDto[]>([]);

  keyword = 'name';
  statusForm: boolean = true


  constructor(
    public activeModal: NgbActiveModal,
    private helperService: HelperService,
    private service: GeneralParameterService,
    private fb: FormBuilder) {
    this.frmItem = this.fb.group({
      Codigo: ['',[Validators.required]],
      PersonaId: ['',[Validators.required]],
      Activo:[true]
    });
  }

  ngOnInit(): void {
    this.cargarPersona();
  }
  cargarPersona():Promise<void>{
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
      this.service.datatable('Persona', emptyDatatableParameter).subscribe(res => {
        const persona = res.data.map((item: any) => {
          return {
            id: item.id,
            name: item.nombres
          } as DataAutoCompleteDto;
        });
        this.listPersona.set(persona);  // Cambié 'empleados' a 'proyectos'
        this.isLoading = false;
        resolve();
      }, error => {
        console.error('Error loading projects', error);
        this.isLoading = false;
        reject(error);
      });
    });
  }



  selectEvent(item: any) {
        this.frmItem.controls["PersonaId"].setValue(item.id);
  }

  onChangeSearch(val: string) {
  }

  onFocused(e: any) {
    // Aquí puedes manejar el evento de enfoque
    console.log('Input enfocado:', e);
  }

  save() {

    if (this.frmItem.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    this.helperService.showLoading();
    const data = {
      Id: this.Id ?? 0,
      ...this.frmItem.value,
    }

      this.service.save("Instructor",this.Id,data).subscribe(
        (response) => {
          if (response.status) {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
            this.activeModal.dismiss()

          }
        })
  }
}
