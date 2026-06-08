import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-recuperar-password',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './recuperar-password.component.html',
  styleUrl: './recuperar-password.component.scss'
})
export class RecuperarPasswordComponent {

  email: string = '';
  cargando: boolean = false;

  notif = {
    show: false,
    msg: '',
    type: 'success' as 'success' | 'danger' | 'warning' | 'info'
  };

  constructor(private authService: AuthService) {}

  enviarEmail() {
  if (!this.email.trim()) return;
  this.cargando = true;

  this.authService.resetPassword(this.email.trim())
    .then(() => {
      this.mostrarNotif('¡Correo enviado! Revisa tu bandeja de entrada.', 'success');
      this.email = '';
    })
    .catch((error) => {
      console.error('Error al restablecer contraseña:', error);
      switch (error.code) {
        case 'auth/invalid-email':
          this.mostrarNotif('El formato del correo no es válido.', 'danger');
          break;
        case 'auth/user-not-found':
          break;
        case 'auth/too-many-requests':
          this.mostrarNotif('Demasiados intentos. Inténtalo más tarde.', 'danger');
          break;
        case 'auth/network-request-failed':
          this.mostrarNotif('Error de conexión. Comprueba tu conexión a internet.', 'danger');
          break;
        default:
          this.mostrarNotif('No se pudo procesar la solicitud.', 'danger');
          break;
      }
    })
    .finally(() => { this.cargando = false; });
  }

  private mostrarNotif(msg: string, type: 'success' | 'danger' | 'warning' | 'info') {
    this.notif = { show: true, msg, type };
    setTimeout(() => {
      this.notif.show = false;
    }, 4000);
  }
  
}