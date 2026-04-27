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

  // Objeto de notificación idéntico al resto de componentes
  notif = { 
    show: false, 
    msg: '', 
    type: 'success' as 'success' | 'danger' | 'warning' | 'info' 
  };

  constructor(private authService: AuthService) {}

  enviarEmail() {
    if (!this.email) return;
    this.cargando = true;

    this.authService.resetPassword(this.email)
      .then(() => {
        this.mostrarNotif('¡Correo enviado! Revisa tu bandeja de entrada.', 'success');
        this.email = ''; // Limpiamos el campo tras el éxito
      })
      .catch((error) => {
        console.error(error);
        this.mostrarNotif('Error: No se pudo enviar el correo de recuperación.', 'danger');
      })
      .finally(() => {
        this.cargando = false;
      });
  }

  private mostrarNotif(msg: string, type: 'success' | 'danger' | 'warning' | 'info') {
    this.notif = { show: true, msg, type };
    setTimeout(() => {
      this.notif.show = false;
    }, 3000);
  }
  
}