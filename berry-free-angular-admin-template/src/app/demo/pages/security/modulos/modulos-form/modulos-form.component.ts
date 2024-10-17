import { Component, NgModule, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DataSelectDto } from 'src/app/generic/dataSelectDto';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';

@Component({
  selector: 'app-modulos-form',
  standalone: false,
  templateUrl: './modulos-form.component.html',
  styleUrl: './modulos-form.component.css'
})
export class ModulosFormComponent implements OnInit {
  frmModulo: FormGroup;
  statusForm: boolean = true
  id!: number;
  botones = ['btn-guardar', 'btn-cancelar'];
  titulo = "";
  serviceName: String = '';
  titleData: String = '';
  listIcons: any[] = [];
  listModulosPadre = signal<DataSelectDto[]>([]);


  constructor(
    public routerActive: ActivatedRoute,
    private service: GeneralParameterService,
    private helperService: HelperService,
    private modalActive: NgbActiveModal
  ) {
    this.frmModulo = new FormGroup({
      Codigo: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      Nombre: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      Activo: new FormControl(true, Validators.required),
      Icono: new FormControl(null, [Validators.required]),
      ModuloPadreId: new FormControl(null),
    });
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = `Editar ${this.titleData}`;
      this.service.getById(this.serviceName, this.id).subscribe(l => {
        this.frmModulo.controls['Codigo'].setValue(l.data.codigo);
        this.frmModulo.controls['Nombre'].setValue(l.data.nombre);
        this.frmModulo.controls['Activo'].setValue(l.data.activo);

        //Icono
        let id = this.listIcons.findIndex((element: any) => element.textoMostrar == l.data.icono)
        const iconoHtml: any = document.getElementById('icon' + id)
        iconoHtml.style.backgroundColor = "gray";
        this.frmModulo.controls['Icono'].setValue(l.data.icono);

        var data = new DatatableParameter(); data.pageNumber = ""; data.pageSize = ""; data.filter = ""; data.columnOrder = ""; data.directionOrder = ""; data.foreignKey = this.id; data.nameForeignKey = "ModuloHijoId";
        this.service.datatableKey("ModuloPadreModulo", data).subscribe(
          (response) => {
            this.frmModulo.controls['ModuloPadreId'].setValue(response.data[0].moduloPadreId);
          },
          (error) => {

          }
        );
      })
    } else {
      this.titulo = `Crear ${this.titleData}`;
    }

    this.cargarModulosPadre();

    this.listIcons = [
      { textoMostrar: "fa-duotone fa-lock", name: "security" },
      { textoMostrar: "fa-duotone fa-gears", name: "parameter" },
      { textoMostrar: "fa-duotone fa-shop", name: "operational" },
      { textoMostrar: "fa-duotone fa-boxes-stacked", name: "inventory" },
      { textoMostrar: "fa-duotone fa-user", name: "user" },
      { textoMostrar: "fa-duotone fa-window-maximize", name: "window" },
      { textoMostrar: "fa-duotone fa-folder-tree", name: "folder-tree" },
      { textoMostrar: "fa-duotone fa-user-tag", name: "user-tag" },
      { textoMostrar: "fa-duotone fa-folder-open", name: "folder-open" },
      { textoMostrar: "fa-duotone fa-building-columns", name: "bank" },
      { textoMostrar: "fa-duotone fa-users-gear", name: "users-gear" },
      { textoMostrar: "fa-duotone fa-vest", name: "vest" },
      { textoMostrar: "fa-duotone fa-shirt", name: "shirt" },
      { textoMostrar: "fa-duotone fa-scissors", name: "scissors" },
      { textoMostrar: "fa-duotone fa-city", name: "city" },
      { textoMostrar: "fa-duotone fa-map-location-dot", name: "map-location-dot" },
      { textoMostrar: "fa-duotone fa-sliders", name: "sliders" },
      { textoMostrar: "fa-duotone fa-bars", name: "bars" },
      { textoMostrar: "fa-duotone fa-money-bills", name: "money-bills" },
      { textoMostrar: "fa-duotone fa-earth-americas", name: "country" },
      { textoMostrar: "fa-duotone fa-pen-ruler", name: "pen-ruler" },
      { textoMostrar: "fa-duotone fa-briefcase", name: "briefcase" },
      { textoMostrar: "fa-duotone fa-user-gear", name: "user-gear" },
      { textoMostrar: "fa-duotone fa-people-carry-box", name: "carry-box" },
      { textoMostrar: "fa-duotone fa-user-tie", name: "user-tie" },
      { textoMostrar: "fa-duotone fa-warehouse", name: "warehouse" },
      { textoMostrar: "fa-duotone fa-dollar-sign", name: "dollar" },
      { textoMostrar: "fa-duotone fa-money-bill-transfer", name: "money-bill" },
      { textoMostrar: "fa-duotone fa-ruler-vertical", name: "ruler" },
      { textoMostrar: "fa-duotone fa-file-invoice-dollar", name: "invoice-dollar" },
      { textoMostrar: "fa-duotone fa-cart-flatbed-boxes", name: "flatbed-boxes" },
      { textoMostrar: "fa-duotone fa-shop-lock", name: "shop-lock" },
      { textoMostrar: "fa-duotone fa-file-invoice", name: "file-invoice" },
      { textoMostrar: "fa-duotone fa-cash-register", name: "cash-register" },
      { textoMostrar: "fa-duotone fa-cart-shopping", name: "cart-shopping" },
      { textoMostrar: "fa-duotone fa-hat-cowboy", name: "hat-cowboy" },
      { textoMostrar: "fa-duotone fa-list-ol", name: "numeracion" },
      { textoMostrar: "fa-duotone fa-gear", name: "configuracion" },
      { textoMostrar: "fa-duotone fa-file-circle-exclamation", name: "motivos" },
      { textoMostrar: "fa-duotone fa-store", name: "zonas" },
      { textoMostrar: "fa-duotone fa-message-pen", name: "modificaciones" },
      { textoMostrar: "fa-duotone fa-person-shelter", name: "salones" },
      { textoMostrar: "fa-duotone fa-table-picnic", name: "mesas" },
      { textoMostrar: "fa-duotone fa-print", name: "impresoras" },
      { textoMostrar: "fa-duotone fa-dollar-sign", name: "propinas" },
      { textoMostrar: "fa-duotone fa-kitchen-set", name: "cocina" },
      { textoMostrar: "fa-duotone fa-user-tie-hair", name: "Administrativo" },
      {textoMostrar: "fa-duotone fa-car-garage", name : "Parking"},
      {textoMostrar: "fa-duotone fa-memo-circle-info", name : "Detalles"},
      {textoMostrar: "fa-duotone fa-map-location-dot", name : "Zona"},
      {textoMostrar: "mon fa-duotone fa-book-user", name : "Monitoring"},
      {textoMostrar: "fa-duotone fa-solid fa-calendar-range", name : "Calendar"},      
      {textoMostrar: "fa-duotone fa-solid fa-person-walking-dashed-line-arrow-right", name : "Visitas"},
            
    ]
  }

  cargarModulosPadre() {
    this.service.getAll('Modulo').subscribe((res) => {
      res.data.forEach((item: any) => {
        if (item.id != this.id) {
          this.listModulosPadre.update(listModulosPadre => {
            const DataSelectDto: DataSelectDto = {
              id: item.id,
              textoMostrar: item.nombre,
              activo: item.activo
            };

            return [...listModulosPadre, DataSelectDto];
          });
        }
      });
    });
  }

  save() {
    if (this.frmModulo.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    this.helperService.showLoading();
    let data = {
      id: this.id ?? 0,
      ...this.frmModulo.value
    };
    this.service.save(this.serviceName, this.id, data).subscribe(
      (response) => {
        if (response.status) {
          setTimeout(() => {
            this.helperService.hideLoading();
          }, 200);
          this.modalActive.close(true);
          this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
        } else {
          setTimeout(() => {
            this.helperService.hideLoading();
          }, 200);
        }
      },
      (error) => {
        setTimeout(() => {
          this.helperService.hideLoading();
        }, 200);
        this.modalActive.close();
        this.helperService.showMessage(MessageType.ERROR, error);
      }
    )
  }

  cancel() {
    this.modalActive.close();
  }

  iconoSelect(icon: number, card: any) {
    this.frmModulo.controls['Icono'].setValue(this.listIcons[icon].textoMostrar);

    for (let i = 0; i < this.listIcons.length; i++) {
      const iconoHtml: any = document.getElementById('icon' + i)
      iconoHtml.style.backgroundColor = "white";
    }

    const iconoHtml: any = document.getElementById('icon' + icon)
    iconoHtml.style.backgroundColor = "gray";
  }
}

@NgModule({
  declarations: [
    ModulosFormComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule
  ]
})
export class ModulosForModule { }