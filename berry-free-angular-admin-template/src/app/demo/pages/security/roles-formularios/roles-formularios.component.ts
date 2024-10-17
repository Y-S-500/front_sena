import { Component, Input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../generic/general.service';
import { DataSelectDto } from '../../../../generic/dataSelectDto';
import { RolFormulario } from './roles-formularios.module';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-roles-formularios',
  standalone: false,
  templateUrl: './roles-formularios.component.html',
  styleUrl: './roles-formularios.component.css'
})
export class RolesFormulariosComponent implements OnInit {
  botones = ['btn-guardar'];
  @Input() RolId: any = null;
  frmRolesFormularios: FormGroup;
  statusForm: boolean = true;
  listFormularios = signal<DataSelectDto[]>([]);
  listRolesFormularios = signal<RolFormulario[]>([]);
  selectedAll: any[] = [];

  constructor(
    private helperService: HelperService,
    private service: GeneralParameterService
  ) {
    this.frmRolesFormularios = new FormGroup({
      Id: new FormControl(0, Validators.required),
      RolId: new FormControl(this.RolId, Validators.required),
      FormularioId: new FormControl(null),
      Activo: new FormControl(true, Validators.required),
      Formularios: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.cargarLista();
    this.cargarFormularios();
  }

  cargarFormularios() {
    this.service.getAll('Formulario').subscribe((res) => {
      res.data.forEach((item: any) => {
        this.validarSuperAdmin().then((SuperAdmin) => {
          if (!SuperAdmin && !item.superAdmin) {
            this.listFormularios.update(listFormularios => {
              const DataSelectDto: DataSelectDto = {
                id: item.id,
                textoMostrar: `${item.codigo} - ${item.nombre}`,
                activo: item.activo
              };

              return [...listFormularios, DataSelectDto];
            });
          } else if (SuperAdmin) {
            this.listFormularios.update(listFormularios => {
              const DataSelectDto: DataSelectDto = {
                id: item.id,
                textoMostrar: `${item.codigo} - ${item.nombre}`,
                activo: item.activo
              };

              return [...listFormularios, DataSelectDto];
            });
          }
        });
      });
    });
  }

  cargarLista() {
    this.getData().then((datos) => {
      datos.data.forEach((item: any) => {
        this.listRolesFormularios.update(listRolesFormularios => {
          const RolFormulario: RolFormulario = {
            id: item.id,
            activo: item.activo,
            rolId: item.rolId,
            rol: item.rol,
            formularioId: item.formularioId,
            formulario: item.formulario,
          };

          return [...listRolesFormularios, RolFormulario];
        });
      });

      setTimeout(() => {
        $("#datatable").DataTable({
          dom: 'Blfrtip',
          destroy: true,
          language: LANGUAGE_DATATABLE,
          processing: true
        });
      }, 200);
    })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  }

  getData(): Promise<any> {
    var data = new DatatableParameter(); data.pageNumber = ""; data.pageSize = ""; data.filter = ""; data.columnOrder = ""; data.directionOrder = ""; data.foreignKey = this.RolId; data.nameForeignKey = "RolId";
    return new Promise((resolve, reject) => {
      this.service.datatableKey("FormularioRol", data).subscribe(
        (datos) => {
          resolve(datos);
        },
        (error) => {
          reject(error);
        }
      )
    });
  }

  refrescarTabla() {
    $("#datatable").DataTable().destroy();
    this.listRolesFormularios = signal<RolFormulario[]>([]);
    this.cargarLista();
  }

  save() {
    this.frmRolesFormularios.controls['RolId'].setValue(this.RolId);

    if (this.frmRolesFormularios.controls['Formularios'].value == null || this.frmRolesFormularios.invalid) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    } else if (this.frmRolesFormularios.controls['Formularios'].value != null && this.frmRolesFormularios.controls['Formularios'].value.length == 0) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    };

    this.helperService.showLoading();
    const saveObservables = this.frmRolesFormularios.controls['Formularios'].value.map((formularioId: any) => {
      this.frmRolesFormularios.controls['FormularioId'].setValue(formularioId);
      let data = this.frmRolesFormularios.value;
      return this.service.save("FormularioRol", this.frmRolesFormularios.controls['Id'].value, data);
    });

    forkJoin(saveObservables).subscribe(
      () => {
        // Se ejecuta una vez que todas las solicitudes de guardado se completen
        this.refrescarTabla();
        this.frmRolesFormularios.reset();
        this.frmRolesFormularios.controls['Id'].setValue(0);
        this.helperService.showMessage(
          MessageType.SUCCESS,
          Messages.SAVESUCCESS
        );
        this.helperService.hideLoading();
      },
      (error) => {
        this.helperService.showMessage(
          MessageType.WARNING,
          error
        );
        this.helperService.hideLoading();
      }
    );
  }

  update(item: any) {
    this.frmRolesFormularios.controls['Id'].setValue(item.id);
    this.frmRolesFormularios.controls['FormularioId'].setValue(item.formularioId);
    this.frmRolesFormularios.controls['Activo'].setValue(item.activo);
  }

  deleteGeneric(id: any) {
    this.helperService.confirmDelete(() => {
      this.service.delete("FormularioRol", id).subscribe(
        (response) => {
          if (response.status) {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.DELETESUCCESS);
            this.refrescarTabla();
          }
        },
        (error) => {
          this.helperService.showMessage(MessageType.WARNING, error);
        }
      )
    });
  }

  SelectAll(event: any) {
    if (event.target.checked) {
      this.listFormularios().forEach(element => {
        this.selectedAll.push(element.id);
      });
      this.frmRolesFormularios.controls["Formularios"].setValue(this.selectedAll);
    } else {
      this.frmRolesFormularios.controls["Formularios"].setValue(null);
    }
  }

  validarSuperAdmin(): Promise<any> {
    return new Promise((resolve, reject) => {
      var rol = localStorage.getItem('userRol');
      if (rol == "SUPERADMIN") {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }
}