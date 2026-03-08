import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-recuperar-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './recuperar-password.component.html',
  styleUrl: './recuperar-password.component.scss'
})
export class RecuperarPasswordComponent {

  email: string = '';
  cargando: boolean = false;
  mostrarAlert: boolean = false;
  mensaje: string = '';

  constructor(private authService: AuthService) {}

  enviarEmail() {
    if (!this.email) return;
    this.cargando = true;
    this.authService.resetPassword(this.email)
      .then(() => {
        this.mensaje = 'Se ha enviado un correo para restablecer tu contraseña.';
        this.mostrarAlert = true;
      })
      .catch((error) => {
        this.mensaje = `Error: ${error.message}`;
        this.mostrarAlert = true;
      })
      .finally(() => {
        this.cargando = false;
      });
  }
  
}