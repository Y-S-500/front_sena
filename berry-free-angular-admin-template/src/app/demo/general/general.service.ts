import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatatableParameter } from './interfaces/datatable.parameters';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class GeneralParameterService {

  private url = environment.url;
  private header = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.header.set("Content-Type", "application/json");
  }

  public datatable(ruta: String, data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/datatable?PageNumber=${data.pageNumber}&PageSize=${data.pageSize}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}`, { headers: this.header })
  }
  public datatableCompleto(ruta: String, data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/datatableCompleto?PageNumber=${data.pageNumber}&PageSize=${data.pageSize}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}`, { headers: this.header })
  }
  public datatableKeyCompleto(ruta: String, data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/datatableCompleto?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}&NameForeignKey=${data.nameForeignKey}`, { headers: this.header });
  }

  public datatableKey(ruta: String, data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/datatable?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}&NameForeignKey=${data.nameForeignKey}`, { headers: this.header });
  }
  public datatableKeyExtra(ruta: String, data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/datatable?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}&NameForeignKey=${data.nameForeignKey}&ForeignKeyExtra=${data.foreignKeyExtra}`, { headers: this.header });
  }

  public datatableCocina(ruta: String, data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/datatableCocina?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}&NameForeignKey=${data.nameForeignKey}&ForeignKeyExtra=${data.foreignKeyExtra}`, { headers: this.header });
  }

  public datatableDate(ruta: String, data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/datatable?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&FechaInicio=${data.fechaInicio}&FechaFin=${data.fechaFin}`, { headers: this.header });
  }

  public getById(ruta: String, id: any): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/${id}`, { headers: this.header });
  }



  public getAll(ruta: String): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/select`, { headers: this.header });
  }


  // public save(ruta: String, id: any, data: any): Observable<any> {
  //   if (id) {
  //     return this.http.put<any>(`${this.url}${ruta}`, data, { headers: this.header });
  //   }
  //   return this.http.post<any>(`${this.url}${ruta}`, data, { headers: this.header });
  // }

  public save(ruta: String, id: any, data: any): Observable<any> {
    return new Observable((observer) => {
      let request: Observable<any>;

      if (id) {
        request = this.http.put<any>(`${this.url}${ruta}`, data, { headers: this.header });
      } else {
        request = this.http.post<any>(`${this.url}${ruta}`, data, { headers: this.header });
      }

      request.subscribe(
        response => {
          Swal.fire({
            title: "¡Guardado!",
            text: "El registro se ha guardado correctamente.",
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Aceptar"
          });

          observer.next(response);
          observer.complete();
        },
        error => {
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al guardar el registro.",
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "Aceptar"
          });

          observer.error(error);
        }
      );
    });
  }




  public delete(ruta: string, id: any): Observable<any> {
    return new Observable((observer) => {
      if (id == null || id === undefined) {
        observer.error('Invalid ID');
        return;
      }

      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.delete<any>(`${this.url}${ruta}/${id}`, { headers: this.header })
            .subscribe(
              response => {
                Swal.fire({
                  title: "¡Eliminado!",
                  text: "El registro ha sido eliminado.",
                  icon: "success"
                });
                observer.next(response);
                observer.complete();
              },
              error => {
                observer.error(error);
              }
            );
        } else {
          observer.complete();
        }
      });
    });
  }


  public saveMasiveAprendiz(ruta: String, data: any): Observable<any> {
    return this.http.post<any>(`${this.url}${ruta}/aprendizPersonas`, data, { headers: this.header });
  }

  public updateDetalles(ruta: String, data: any): Observable<any> {
    return this.http.post<any>(`${this.url}${ruta}/updateDetalles`, data, { headers: this.header });
  }

  public saveDetails(ruta: String, data: any): Observable<any> {
    return this.http.post<any>(`${this.url}${ruta}/saveDetails`, data, { headers: this.header });
  }



  //Controller Enum
  public getEnum(parametro: String): Observable<any> {
    return this.http.get<any>(`${this.url}Enums?endpoint=${parametro}`, { headers: this.header });
  }


}
