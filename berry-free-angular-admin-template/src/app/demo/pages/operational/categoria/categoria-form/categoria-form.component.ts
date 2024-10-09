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
  selector: 'app-categoria-form',
  standalone: true,
  imports: [FormsMessagesComponent,ToastrModule,NgSelectModule,ReactiveFormsModule,AutocompleteLibModule, BotonesComponent, CommonModule,FormsModule],
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.scss'
})
export class CategoriaFormComponent {
  frmCategoria: FormGroup;
  tipos: string[] = ['Cuantitativo', 'Cualitativo'];
  isLoading: boolean = false;
  Id!:number;


  keyword = 'name';
  statusForm: boolean = true


  constructor(
    public activeModal: NgbActiveModal,
    private helperService: HelperService,
    private service: GeneralParameterService,
    private fb: FormBuilder) {
    this.frmCategoria = this.fb.group({
      Nombre: ['',[Validators.required]],
      Activo:[true]
    });
  }

  ngOnInit(): void {


  }


  save() {
    console.log("asdas");

    if (this.frmCategoria.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    this.helperService.showLoading();
    const data = {
      Id: this.Id ?? 0,
      ...this.frmCategoria.value,
    }

      this.service.save("Categoria",this.Id,data).subscribe(
        (response) => {
          if (response.status) {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
            this.activeModal.dismiss()

          }
        })
  }
}
