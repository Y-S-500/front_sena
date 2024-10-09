import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ToastrModule } from 'ngx-toastr';
import { BotonesComponent } from 'src/app/demo/general/botones/botones.component';
import { FormsMessagesComponent } from 'src/app/demo/general/forms-messages/forms-messages.component';
import { GeneralParameterService } from 'src/app/demo/general/general.service';
import { HelperService, Messages, MessageType } from 'src/app/demo/general/helper.service';

@Component({
  selector: 'app-persona-form',
  standalone: true,
  imports: [FormsMessagesComponent,ToastrModule,NgSelectModule,ReactiveFormsModule,AutocompleteLibModule, BotonesComponent, CommonModule,FormsModule],
  templateUrl: './persona-form.component.html',
  styleUrl: './persona-form.component.scss'
})
export class PersonaFormComponent {
  frmPersona: FormGroup;
  tipos: string[] = ['Cuantitativo', 'Cualitativo'];
  isLoading: boolean = false;
  Id!:number;


  statusForm: boolean = true


  constructor(
    public activeModal: NgbActiveModal,
    private helperService: HelperService,
    private service: GeneralParameterService,
    private fb: FormBuilder) {
    this.frmPersona = this.fb.group({
      Nombres: ['',[Validators.required]],
      Apellidos: ['',[Validators.required]],
      TipoId: ['',[Validators.required]],
      NumeroId: ['',[Validators.required]],
      Telefono: ['',[Validators.required]],
      Email: ['',[Validators.required,Validators.email]],
      Activo:[true]
    });
  }

  ngOnInit(): void {


  }

  onlyNumber(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }


  save() {
    console.log("asdas");

    if (this.frmPersona.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    this.helperService.showLoading();
    const data = {
      Id: this.Id ?? 0,
      ...this.frmPersona.value,
    }

      this.service.save("Persona",this.Id,data).subscribe(
        (response) => {
          if (response.status) {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
            this.activeModal.dismiss()

          }
        })
  }
}
