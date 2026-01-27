import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recuperar-password',
  imports: [FormsModule],
  templateUrl: './recuperar-password.component.html',
  styleUrl: './recuperar-password.component.scss'
})
export class RecuperarPasswordComponent {
  email: string = '';
  cargando: boolean = false;
  mensaje: string = '';
  mostrarAlert: boolean = false;

  enviarEmail() {
    if (!this.email.trim()) return;

    this.cargando = true;
    this.mensaje = '';
    this.mostrarAlert = false;

    setTimeout(() => {
      this.cargando = false;
      this.mensaje = `Se ha enviado un enlace de recuperación a ${this.email}`;
      this.mostrarAlert = true;
      this.email = '';
    }, 2000);
  }

}