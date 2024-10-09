import { HelperService } from './../../../../general/helper.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralParameterService } from 'src/app/demo/general/general.service';
import { Messages, MessageType } from 'src/app/demo/general/helper.service';
import { FormsMessagesComponent } from "../../../../general/forms-messages/forms-messages.component";
import { BotonesComponent } from "../../../../general/botones/botones.component";
import { UiSwitchModule } from 'ngx-ui-switch';

@Component({
  selector: 'app-actividad-form',
  standalone: true,
  imports: [CommonModule, UiSwitchModule,FormsModule, FormsMessagesComponent,ReactiveFormsModule,  BotonesComponent],
  templateUrl: './actividad-form.component.html',
  styleUrl: './actividad-form.component.scss'
})
export class ActividadFormComponent {
  frmActivida: FormGroup;
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
    this.frmActivida = new FormGroup({
      Id: new FormControl(0),
      Nombre: new FormControl("", [Validators.required]),
      FechaInicio: new FormControl(null, [Validators.required]),
      FechaFin: new FormControl(null, [Validators.required]),
      Duracion: new FormControl("", [Validators.required]),
      Activo: new FormControl(true)
    });
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.frmActivida.controls['Id'].setValue(this.id);
      this.service.getById("Persona", this.id).subscribe(l => {
        this.frmActivida.controls['Documento'].setValue(l.data.nombre);
        this.frmActivida.controls['TipoDocumento'].setValue(l.data.fechaInicio);
        this.frmActivida.controls['PrimerNombre'].setValue(l.data.fechaFin);
        this.frmActivida.controls['SegundoNombre'].setValue(l.data.duracion);
        this.frmActivida.controls['Activo'].setValue(l.data.activo);
      })
    }
  }


  save() {
    if (this.frmActivida.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    this.helperService.showLoading();
    const data = {
      Id: this.id ?? 0,
      ...this.frmActivida.value,
    }

      this.service.save("Actividad",this.id,data).subscribe(
        (persona) => {
          this.frmActivida.controls["Id"].setValue(persona.id);
        })
    }

    cancel() {
      this.helperService.redirectApp('adashboard/actividad');
    }
}
