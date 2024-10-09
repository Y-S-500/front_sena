import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralParameterService } from 'src/app/demo/general/general.service';
import { HelperService, Messages, MessageType } from 'src/app/demo/general/helper.service';
import { BotonesComponent } from "../../../../general/botones/botones.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { FormsMessagesComponent } from 'src/app/demo/general/forms-messages/forms-messages.component';

@Component({
  selector: 'app-programa-form',
  standalone: true,
  imports: [FormsMessagesComponent,ToastrModule,NgSelectModule,ReactiveFormsModule,AutocompleteLibModule, BotonesComponent, CommonModule,FormsModule],
  templateUrl: './programa-form.component.html',
  styleUrl: './programa-form.component.scss'
})
export class ProgramaFormComponent {
  frmPrograma: FormGroup;
  tipos: string[] = ['Cuantitativo', 'Cualitativo'];
  isLoading: boolean = false;
  Id!:number;


  statusForm: boolean = true


  constructor(
    public activeModal: NgbActiveModal,
    private helperService: HelperService,
    private service: GeneralParameterService,
    private fb: FormBuilder) {
    this.frmPrograma = this.fb.group({
      Codigo: ['',[Validators.required]],
      Nombre: ['',[Validators.required]],
      Activo:[true]
    });
  }

  ngOnInit(): void {


  }


  save() {
    console.log("asdas");

    if (this.frmPrograma.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    this.helperService.showLoading();
    const data = {
      Id: this.Id ?? 0,
      ...this.frmPrograma.value,
    }

      this.service.save("Programa",this.Id,data).subscribe(
        (response) => {
          if (response.status) {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
            this.activeModal.dismiss()

          }
        })
  }
}
