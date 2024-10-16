import { NgSelectModule } from '@ng-select/ng-select';
import { HelperService, Messages, MessageType } from './../../../../general/helper.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // No need to import FormsModule if you're using Reactive Forms
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralParameterService } from 'src/app/demo/general/general.service';
import { DataSelectDto } from 'src/app/demo/general/interfaces/dataSelectDto';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { RouterModule } from '@angular/router';
import { FormsMessagesComponent } from 'src/app/demo/general/forms-messages/forms-messages.component';
import { Subject } from 'rxjs';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { LANGUAGE_DATATABLE } from 'src/app/demo/general/interfaces/datatable.language';



@Component({
  selector: 'app-ficha-modal',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    ReactiveFormsModule,
    DataTablesModule,
    RouterModule, FormsMessagesComponent
  ],
  templateUrl: './ficha-modal.component.html',
  styleUrls: ['./ficha-modal.component.css']
})

export class FichaModalComponent implements OnInit {
  frmAprendices: FormGroup;
  statusForm: boolean = true
  botones = ['btn-cancelar'];
  file?: File;
  Aprendices: any[] = [];
  listFichas = signal<DataSelectDto[]>([]);
  uploadData = true;

  public dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtOptions = {};

  constructor(
    private service: GeneralParameterService,
    private helperService: HelperService,
    private modalActive: NgbActiveModal,
  ) {
    this.frmAprendices = new FormGroup({
      FichaId: new FormControl(null, [Validators.required]),
    });
  }


  ngOnInit(): void {
    this.cargarLista();
    this.cargarFichas();
  }

  cargarFichas() {
    this.service.getAll('Ficha').subscribe((res) => {
      res.data.forEach((item: any) => {
        this.listFichas.update(listCategorias => {
          const DataSelectDto: DataSelectDto = {
            id: item.id,
            textoMostrar: `${item.codigo} - ${item.nombre}`,
            activo: item.activo
          };

          return [...listCategorias, DataSelectDto];
        });
      });
    });
  }

  cancel() {
    setInterval(() => {
      this.modalActive.close();
    }, 500)
  }

  readURL(event: any) {
    if (this.frmAprendices.invalid) {
      this.removeUpload();
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    if (event.target.files && event.target.files[0]) {
      $('.archivo-upload-wrap').hide();
      $('.archivo-title').html(event.target.files[0].name);
      $('.file-upload-content').show();

      const reader = new FileReader();
      reader.readAsArrayBuffer(event.target.files[0]);

      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const xlsxData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.readFile(xlsxData);
      };
    } else {
      this.removeUpload();
    }
  }

  removeUpload() {
    const fileInput = document.getElementById('excel_File') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';  // Reset file input
    }

    $('.file-upload-content').hide();
    $('.archivo-upload-wrap').show();
    $('.archivo-upload-wrap').removeClass('archivo-dropping');

    this.Aprendices = [];
    this.redrawTable();
    this.uploadData = true;

  }

  downloadFile() {
    let link = document.createElement("a");
    link.download = "Plantilla Importar Aprendices.xlsx";
    link.href = "../../../../../../assets/documentos/RegistroMasivo.xlsx";
    link.click();
    link.remove();
  }

  readFile(data: any) {
    this.Aprendices = [];

    const requiredColumns = ["Nombres", "Apellidos", "Tipo Indentificación", "Numero Indentificación", "Numero Indentificación", "Email",];
    const headerRow = data[0];


    let columnsValid = requiredColumns.every(col => headerRow.includes(col));

    if (!columnsValid) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Debes cargar la plantilla proporcionada por el sistema, de lo contrario no se podrá realizar la carga masiva',
      }).then(() => {
        this.removeUpload();
      });
      this.uploadData = false;
      return;
    }

    for (let i = 1; i < data.length; i++) {
      const element = data[i];
      if (element.length > 1) {

        const aprendiz: any = {
          Nombres: element[0],
          Apellidos: element[1],
          TipoId: element[2],
          NumeroId: element[3],
          FichaId: this.frmAprendices.controls["FichaId"].value,
          Telefono: element[4],
          Email: element[5],
          Activo: true
        };
        if (element[0] != null && element[1] != null && element[2] != null && element[3] != null && element[4] != null && element[5] != null) {

          this.Aprendices.push(aprendiz);
        } else {
          Swal.fire({
            icon: 'info',
            title: 'El archivo no está completamente diligenciado',
            text: 'Todos los campos deben estar completos',
            confirmButtonText: 'Ok'
          })
        }
      }
    }
    this.redrawTable();
    this.cargarLista();
  }

  ngAfterViewInit() {
    this.dtTrigger.next(this.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cargarLista() {
    this.dtOptions = {
      dom: 'lfrtip',
      processing: true,
      ordering: true,
      paging: true,
      order: [0, 'desc'],
      language: LANGUAGE_DATATABLE,
      data: this.Aprendices, // Datos que mostrarán en la tabla
      columns: [
        {
          title: 'Nombres',
          data: 'Nombres',
          className: 'text-center',
        },
        {
          title: 'Apellidos',
          data: 'Apellidos',
          className: 'text-center',
        },
        {
          title: 'Email',
          data: 'Email',
          className: 'text-center',
        }
      ],
    };

    if (this.Aprendices.length > 0) {
      this.uploadData = true;
    }
  }

  redrawTable() {
    if (typeof this.dtElement.dtInstance != 'undefined') {
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.ajax.reload();
      });
    }

    if (this.Aprendices.length > 0) {
      this.uploadData = true;
    }
  }

  upload() {
    if (this.frmAprendices.invalid) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    Swal.fire({
      icon: 'warning',
      title: '¿Está seguro de realizar esta acción?',
      text: "Esta acción no se puede deshacer",
      showCancelButton: true,
      confirmButtonColor: '#F8E12E',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Guardar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // this.helperService.showLoading();

        this.service.saveMasiveAprendiz('Aperndiz', this.Aprendices).subscribe(
          (response) => {
            // this.helperService.hideLoading();
            if (response.data && response.data.length > 0) {

              Swal.fire({
                icon: 'success',
                title: 'Carga Exitosa',
                text: 'Todos los datos han sido importados correctamente',
                confirmButtonText: 'Cerrar'
              }).then(() => {
                this.modalActive.close(true);
                // this.helperService.showMessage(MessageType.SUCCESS, "Datos importados correctamente");
              });
            }
          },
          (error) => {
            // this.helperService.hideLoading();
            // this.helperService.showMessage(MessageType.ERROR, error);
          }
        );
      }
    });
  }
}
