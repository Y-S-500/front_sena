import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BotonesComponent } from 'src/app/demo/general/botones/botones.component';
import { FormsMessagesComponent } from 'src/app/demo/general/forms-messages/forms-messages.component';
import { GeneralParameterService } from 'src/app/demo/general/general.service';
import { HelperService, Messages, MessageType } from 'src/app/demo/general/helper.service';

@Component({
  selector: 'app-proyecto-form',
  standalone: true,
  imports: [CommonModule, FormsModule, FormsMessagesComponent,ReactiveFormsModule,  BotonesComponent],
  templateUrl: './proyecto-form.component.html',
  styleUrl: './proyecto-form.component.scss'
})
export class ProyectoFormComponent {
  frmProyecto: FormGroup;
  statusForm: boolean = true
  id!: number;
  documento = "";
  botones = ['btn-guardar', 'btn-cancelar'];
  titulo = "";


  constructor(
    public routerActive: ActivatedRoute,
    private service: GeneralParameterService,
    private helperService: HelperService,
  ) {
    this.frmProyecto = new FormGroup({
      Id: new FormControl(0),
      Codigo: new FormControl("", [Validators.required]),
      Nombre: new FormControl(null, [Validators.required]),
      Activo: new FormControl(true)
    });
    this.routerActive.params.subscribe((l) => (this.id = l['id']));

  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.frmProyecto.controls['Id'].setValue(this.id);
      this.service.getById("Proyecto", this.id).subscribe(l => {
        this.frmProyecto.controls['Codigo'].setValue(l.data.codigo);
        this.frmProyecto.controls['Nombre'].setValue(l.data.nombre);
        this.frmProyecto.controls['Activo'].setValue(l.data.activo);
      })
    }
  }


  save() {
    if (this.frmProyecto.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    this.helperService.showLoading();
    const data = {
      Id: this.id ?? 0,
      ...this.frmProyecto.value,
    }

      this.service.save("Proyecto",this.id,data).subscribe(
        (persona) => {
          this.frmProyecto.controls["Id"].setValue(persona.id);
          if(persona.data != null){
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);

            this.helperService.redirectApp('adashboard/proyecto');
          }
        })
    }

    cancel() {
      this.helperService.redirectApp('adashboard/proyecto');
    }

}
