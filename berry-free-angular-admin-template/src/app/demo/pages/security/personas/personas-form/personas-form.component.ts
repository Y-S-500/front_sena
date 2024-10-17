import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';

@Component({
  selector: 'app-personas-form',
  standalone: false,
  templateUrl: './personas-form.component.html',
  styleUrl: './personas-form.component.css'
})
export class PersonasFormComponent implements OnInit {
  frmPersonas: FormGroup;
  statusForm: boolean = true
  id!: number;
  documento = "";
  botones = ['btn-guardar', 'btn-cancelar'];
  titulo = "";
  serviceName: String = '';
  titleData: String = '';
  key: string = "";
  //variable para instanciarle en visitas
  visitantesPersonaId = false;

  //se implementa para crear una persona directamente como empleado
  creacionPersonaEmpleado: boolean = false;
  public lista: any[] = [];
  public listGeneros: any[] = [];
  public ListTipoIdentificacion: any[] = [];
  cliente = false;

  constructor(
    public routerActive: ActivatedRoute,
    private service: GeneralParameterService,
    private helperService: HelperService,
    private modalActive: NgbActiveModal
  ) {
    this.frmPersonas = new FormGroup({
      Id: new FormControl(0),
      ClienteId: new FormControl(null),
      Documento: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      TipoDocumento: new FormControl(null, [Validators.required]),
      PrimerNombre: new FormControl("", [Validators.required, Validators.maxLength(100)]),
      SegundoNombre: new FormControl(""),
      PrimerApellido: new FormControl("", [Validators.required, Validators.maxLength(100)]),
      SegundoApellido: new FormControl(""),
      Email: new FormControl("", [Validators.required, Validators.maxLength(50)]),
      Direccion: new FormControl("", [Validators.required, Validators.maxLength(150)]),
      Telefono: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      Activo: new FormControl(true, Validators.required),
      Genero: new FormControl(null, [Validators.required]),
      Key_Id: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.documento != "") {
      this.frmPersonas.controls['Documento'].setValue(this.documento);
      this.onChangeDocumento();
    }
    if (this.id != undefined && this.id != null) {
      this.frmPersonas.controls['Id'].setValue(this.id);
      this.titulo = `Editar ${this.titleData}`;
      this.service.getById(this.serviceName, this.id).subscribe(l => {
        this.frmPersonas.controls['Documento'].setValue(l.data.documento);
        this.frmPersonas.controls['TipoDocumento'].setValue(l.data.tipoDocumento);
        this.frmPersonas.controls['PrimerNombre'].setValue(l.data.primerNombre);
        this.frmPersonas.controls['SegundoNombre'].setValue(l.data.segundoNombre);
        this.frmPersonas.controls['PrimerApellido'].setValue(l.data.primerApellido);
        this.frmPersonas.controls['SegundoApellido'].setValue(l.data.segundoApellido);
        this.frmPersonas.controls['Email'].setValue(l.data.email);
        this.frmPersonas.controls['Direccion'].setValue(l.data.direccion);
        this.frmPersonas.controls['Telefono'].setValue(l.data.telefono);
        this.frmPersonas.controls['Activo'].setValue(l.data.activo);
        this.frmPersonas.controls['Genero'].setValue(l.data.genero);

        var keyId = this.toCamelCase(this.key);
        this.frmPersonas.controls['Key_Id'].setValue(
          l.data[keyId + 'Id']
        );
      })
    } else {
      this.titulo = `Crear ${this.titleData}`;
    }

    this.cargarListaForeingKey();

    this.ListTipoIdentificacion = [
      { id: 'CC', textoMostrar: 'Cedula de Ciudadania' },
      { id: 'PAS', textoMostrar: 'Pasaporte' },
      { id: 'TI', textoMostrar: 'Tarjeta de Identidad' },
      { id: 'CE', textoMostrar: 'Cedula de Extranjeria' },
      { id: 'NIT', textoMostrar: 'NIT' },
    ];

    this.listGeneros = [
      { id: 1, textoMostrar: 'Masculino' },
      { id: 2, textoMostrar: 'Femenino' },
    ];
  }

  cargarListaForeingKey() {
    this.service.getAll(this.key).subscribe((r) => {
      this.lista = r.data;
    });
  }

  save() {
    this.frmPersonas.controls['Telefono'].setValue(String(this.frmPersonas.controls['Telefono'].value));

    if (this.frmPersonas.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    this.helperService.showLoading();
    var clienteId = this.frmPersonas.controls["ClienteId"].value;
    var personaId = this.frmPersonas.controls["Id"].value;

    if (personaId == 0) {
      this.savePersona().then(
        (persona) => {
          this.frmPersonas.controls["Id"].setValue(persona.id);
          setTimeout(() => {
            this.saveCliente().then((cliente) => {
              this.messageSuccess(cliente);
            }).catch((error) => {
              console.error('Error al guardar el cliente:', error);
            });
          }, 200);
        }
      ).catch((error) => {
        console.error('Error al guardar la persona:', error);
      });
    } else {
      this.savePersona().then(
        (persona) => {
          setTimeout(() => {
            if (clienteId == null) {
              this.saveCliente().then((cliente) => {
                this.messageSuccess(cliente);
              }).catch((error) => {
                console.error('Error al guardar el cliente:', error);
              });
            }else{
              this.messageSuccess(persona);
            }
          }, 200);
        }
      ).catch((error) => {
        console.error('Error al guardar la persona:', error);
      });
    }
  }

  messageSuccess(data: any) {
    if (!this.visitantesPersonaId) {
      this.modalActive.close(true);
    } else {
      this.modalActive.close(data);
    }
    this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
  }

  saveCliente(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.helperService.showLoading();
      let data = {
        id: 0,
        Codigo: "CLI",
        Nombre: `${this.frmPersonas.controls["PrimerNombre"].value} ${this.frmPersonas.controls["PrimerApellido"].value}`,
        Activo: true,
        PersonaId: this.frmPersonas.controls["Id"].value,
      }
      this.service.save("Cliente", data.id, data).subscribe(
        (response) => {
          if (response.status) {
            resolve(response.data);
          }
        },
        (error) => {
          this.helperService.hideLoading();
          reject(error);
        }
      )
    })
  }

  savePersona(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.helperService.showLoading();

      let data = {
        [this.key + 'Id']: this.frmPersonas.controls['Key_Id'].value,
        ...this.frmPersonas.value,
        Cliente: this.cliente,
        Empleado: this.creacionPersonaEmpleado
      };

      this.service.save(this.serviceName, data.Id, data).subscribe(
        (response) => {
          if (response.status) {
            resolve(response.data);
          }
        },
        (error) => {
          this.helperService.hideLoading();
          reject(error);
        }
      )
    });
  }

  cancel() {
    this.modalActive.close(false);
  }

  toCamelCase(input: string): string {
    return input.replace(/^[A-Z]/, (match) => match.toLowerCase());
  }

  onChangeDocumento() {
    var documento = this.frmPersonas.controls["Documento"].value;
    if (documento != "" && documento != null) {
      this.helperService.showLoading();
      this.getPersonaByDocumento(documento);
    } else {
      this.resetFrmPersona();
    }
  }

  getPersonaByDocumento(documento: number) {
    this.service.getByDocument("Persona", documento).subscribe(
      (response) => {
        this.helperService.hideLoading();
        if (response.status) {
          //La persona está registrada
          this.frmPersonas.controls["Id"].setValue(response.data.id);
          this.frmPersonas.controls["TipoDocumento"].setValue(response.data.tipoDocumento);
          this.frmPersonas.controls["PrimerNombre"].setValue(response.data.primerNombre);
          this.frmPersonas.controls["SegundoNombre"].setValue(response.data.segundoNombre);
          this.frmPersonas.controls["PrimerApellido"].setValue(response.data.primerApellido);
          this.frmPersonas.controls["SegundoApellido"].setValue(response.data.segundoApellido);
          this.frmPersonas.controls["Email"].setValue(response.data.email);
          this.frmPersonas.controls["Direccion"].setValue(response.data.direccion);
          this.frmPersonas.controls["Telefono"].setValue(response.data.telefono);
          this.frmPersonas.controls["Genero"].setValue(response.data.genero);
          this.frmPersonas.controls["Key_Id"].setValue(response.data.ciudadId);

          this.getClienteByPersonaId(response.data.id).then((cliente) => {
            this.frmPersonas.controls["ClienteId"].setValue(cliente.id);
          }).catch((error) => {
            this.frmPersonas.controls["ClienteId"].setValue(null);
          });

        } else {
          this.resetFrmPersona();
        }
      },
      (error) => {
        this.helperService.showMessage(MessageType.WARNING, error);
      }
    );
  }

  getClienteByPersonaId(personaId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.service.getByPersonaId("Cliente", personaId).subscribe(
        (response) => {
          this.helperService.hideLoading();
          if (response.status) {
            resolve(response.data);
          } else {
            reject("No se encontro un cliente asociado a esa persona");
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  resetFrmPersona() {
    this.frmPersonas.controls["Id"].setValue(0);
    this.frmPersonas.controls["TipoDocumento"].setValue(null);
    this.frmPersonas.controls["PrimerNombre"].setValue("");
    this.frmPersonas.controls["SegundoNombre"].setValue("");
    this.frmPersonas.controls["PrimerApellido"].setValue("");
    this.frmPersonas.controls["SegundoApellido"].setValue("");
    this.frmPersonas.controls["Email"].setValue("");
    this.frmPersonas.controls["Direccion"].setValue("");
    this.frmPersonas.controls["Telefono"].setValue(null);
    this.frmPersonas.controls["Genero"].setValue(null);
    this.frmPersonas.controls["Key_Id"].setValue(null);
  }
}

@NgModule({
  declarations: [
    PersonasFormComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule
  ]
})
export class PersonasFormModule { }