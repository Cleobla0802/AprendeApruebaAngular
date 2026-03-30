import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserCredential } from 'firebase/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  errores = false;
  loading = false;
  mensajeError = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      this.errores = false;
      
      const { email, password } = this.loginForm.value;

      // Usamos los valores directamente del formulario
      this.authService.login(email!, password!)
        .then((user: UserCredential) => {
          this.router.navigate(['/componentes/apuntes']);
        })
        .catch((error) => {
          this.errores = true;
          this.loading = false;
          
          // Control simple de errores de inicio de sesión
          if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            this.mensajeError = 'Correo o contraseña incorrectos.';
          } else if (error.code === 'auth/too-many-requests') {
            this.mensajeError = 'Demasiados intentos. Inténtalo más tarde.';
          } else {
            this.mensajeError = 'Error al iniciar sesión. Inténtalo de nuevo.';
          }
          console.log(error.code);
        });
    } else {
      this.errores = true;
      this.mensajeError = 'Por favor, rellena todos los campos correctamente.';
    }
  }

  loginWithGoogle() {
    if (this.loading) return;
    this.loading = true;
    
    this.authService.loginWithGoogle()
      .then((user: UserCredential) => {
        this.router.navigate(['/componentes/apuntes']);
      })
      .catch((error: any) => {
        console.log(error);
        this.loading = false;
        this.errores = true;
        this.mensajeError = 'Error al conectar con Google.';
      });
  }
}