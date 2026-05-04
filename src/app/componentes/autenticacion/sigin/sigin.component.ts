import { Component } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sigin',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './sigin.component.html',
  styleUrl: './sigin.component.scss'
})
export class SiginComponent {
registerForm: FormGroup;
  errores = false;
  loading = false; 
  mensajeError = ''; 
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, { validators: this.passwordsMatchValidator });
  }

  register() {
    if (this.registerForm.valid) {
      if (this.loading) return;

      this.loading = true;
      this.errores = false;
      this.mensajeError = '';
      
      const { username, email, password } = this.registerForm.value;

      this.authService.register(email, password)
        .then((userCredential: UserCredential) => {
          return this.authService.saveUsername(userCredential.user.uid, username);
        })
        .then(() => {
          this.router.navigate(['/componentes/apuntes']);
        })
        .catch(error => {
          this.errores = true;
          this.loading = false;

          if (error.code === 'auth/email-already-in-use') {
            this.mensajeError = 'Este correo electrónico ya está en uso por otra cuenta.';
          } else if (error.code === 'auth/invalid-email') {
            this.mensajeError = 'El formato del correo no es válido.';
          } else if (error.code === 'auth/weak-password') {
            this.mensajeError = 'La contraseña es muy débil.';
          } else {
            this.mensajeError = 'Ocurrió un error al intentar registrarte.';
          }
        });
    } else {
      // Forzamos que se vean los alerts rojos de Bootstrap si el formulario es inválido
      this.registerForm.markAllAsTouched();
    }
  }

  loginWithGoogle() {
    if (this.loading) return;
    this.loading = true;
    this.authService.loginWithGoogle()
      .then(() => this.router.navigate(['/componentes/apuntes']))
      .catch(err => {
        this.errores = true;
        this.mensajeError = 'Error al conectar con Google.';
        this.loading = false;
      });
  }

  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
