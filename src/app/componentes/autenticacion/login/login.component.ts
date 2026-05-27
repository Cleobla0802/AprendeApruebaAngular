import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
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
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  errores = false;
  loading = false;
  mensajeError = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    // Si el formulario es válido, procedemos
    if (this.loginForm.valid) {
      this.loading = true;
      this.errores = false;
      this.mensajeError = '';
      
      const { email, password } = this.loginForm.value;

      this.authService.login(email!, password!)
        .then(() => {
          this.router.navigate(['/componentes/apuntes']);
        })
        .catch((error) => {
          this.loading = false;
          this.errores = true;
          
          // Errores de Firebase (Servidor)
          if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
            this.mensajeError = 'Credenciales incorrectas. Revisa el correo o la contraseña.';
          } else if (error.code === 'auth/too-many-requests') {
            this.mensajeError = 'Demasiados intentos. Prueba en unos minutos.';
          } else {
            this.mensajeError = 'Vaya, algo ha fallado. Prueba otra vez.';
          }
        });
    } else {
      // Si el usuario le da a "Entrar" y falta algo, forzamos que salgan los alerts rojos de bootstrap
      this.loginForm.markAllAsTouched();
    }
  }

  loginWithGoogle() {
    if (this.loading) return;
    this.loading = true;
    
    this.authService.loginWithGoogle()
      .then(() => {
        this.router.navigate(['/componentes/apuntes']);
      })
      .catch(() => {
        this.loading = false;
        this.errores = true;
        this.mensajeError = 'Error al conectar con Google.';
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
