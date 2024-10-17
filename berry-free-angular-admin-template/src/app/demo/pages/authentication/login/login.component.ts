import { HttpClientModule } from '@angular/common/http';
// angular import
import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Data, Router, RouterLink, RouterModule } from '@angular/router';
import { GeneralParameterService } from 'src/app/demo/general/general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, FormsModule, ReactiveFormsModule, RouterLink, NgClass, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;
  showError = false;
  alertHtml: string = '';
  isLoggedIn = false;


  constructor(private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    // private readonly _functions: Functions,
    private Service: GeneralParameterService) { }

  onClick() {
    console.log('Button clicked');
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      userName: ['', [Validators.required,]],
      password: ['', Validators.required],
    });

  }

  registrarse() {
  this._router.navigate(['/auth/sign-up-mat'])
  }
  olvidoPassword(){
    this._router.navigate(['/auth/forgot-password-mat'])
  }

  IniciarSeccion() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }



    // this._functions.showLoading();

    if (this.form.invalid) return; {
      const Data = {
        ...this.form.value
      }

      this.Service.Login(Data).subscribe({
        next: (response: any) => {
          if (response.token) {
            // Almacenar token en localStorage
            localStorage.setItem("token", response.token);
            const userId = response.user.user.id;
            const personaId = response.user.user.personaId;
            const userName = response.user.user.userName;

            localStorage.setItem("userId", userId.toString());
            localStorage.setItem("userName", userName.toString());

            localStorage.setItem("personaId", personaId.toString());


            if (response.user.user.restoredPassword) {
              // this._functions.hideLoading();
              this._router.navigate(['/auth/new-password-mat']);

            } else {
              // Almacenar el menú de usuario si existe
              if (response.user && response.user.menus) {
                localStorage.setItem("Menu", JSON.stringify(response.user.menus));
              }
              // this._functions.hideLoading();
              // Redirigir al usuario al dashboard o página principal
              this.isLoggedIn = true;
              window.location.href = '/dashboard';

            }

          }
        },
        error: (err) => {
          // this._functions.hideLoading();
          Swal.fire({
            icon: "error",
            title: "Error de autenticación",
            text: "Las credenciales que ingresaste son incorrectas. Por favor, intenta nuevamente.",
            confirmButtonText: "Intentar de nuevo",
            confirmButtonColor: "#3085d6",
          }).then((result) => {
            if (result.isConfirmed) {
              // Acción cuando se confirma el alert
            }
          });
        }
      });
    }
  }


  // Method to check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
 // Método para cerrar sesión y eliminar el token
  /*   logout(): void {
      console.log("Ejecutnado")
      localStorage.removeItem("token");  // Elimina el token de localStorage
      this._router.navigate(['/auth/sign-in']);  // Redirige al login
    }
   */

  RetrocederV() {
    localStorage.removeItem("token");
    this._router.navigate(['/auth/sign-in']).then(() => {
      window.location.replace('/auth/sign-in');
    });
  }


  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.IniciarSeccion();
  }

  /* if(this.form.invalid)return; {

    const objecto: Data = {
      username:this.form.value.username,
      password:this.form.value.password,

    };
    this.Service.Login(Data).subscribe(
      (response)=>{
        console.log("hola")
        window.location.href='/';

      },
      (error: any) => {
      console.log(error);
      }
    );
  }
  }
  */
}
