import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmailAuthProvider, GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup, updatePassword } from 'firebase/auth';

@Component({
  selector: 'app-crear-nueva-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-nueva-password.component.html',
  styleUrl: './crear-nueva-password.component.scss'
})
export class CrearNuevaPasswordComponent {

  contrasenaActual: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  cargando: boolean = false;
  mensaje: string = '';
  mensajeError: string = '';
  mostrarActual: boolean = false;
  mostrarNueva: boolean = false;
  mostrarConfirmar: boolean = false;


  constructor(private auth: Auth, private router: Router) { }

  async cambiarContrasena(): Promise<void> {
    this.mensaje = '';
    this.mensajeError = '';

    const user = this.auth.currentUser;

    if (!user) {
      this.mensajeError = 'No hay ningún usuario autenticado. Por favor, inicia sesión de nuevo.';
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.mensajeError = 'Las contraseñas nuevas no coinciden.';
      return;
    }

    this.cargando = true;

    try {
      // Solo reautenticamos si tiene email/contraseña
      if (user.email && this.contrasenaActual) {
        const credencial = EmailAuthProvider.credential(user.email, this.contrasenaActual);
        await reauthenticateWithCredential(user, credencial);
      }

      await updatePassword(user, this.nuevaContrasena);
      this.mensaje = '¡Contraseña actualizada correctamente!';
      this.contrasenaActual = '';
      this.nuevaContrasena = '';
      this.confirmarContrasena = '';

    } catch (error: any) {
      this.mensajeError = this.traducirError(error.code);
    } finally {
      this.cargando = false;
    }
  }

  private traducirError(codigo: string): string {
    const errores: Record<string, string> = {
      'auth/wrong-password': 'La contraseña actual es incorrecta.',
      'auth/invalid-credential': 'La contraseña actual es incorrecta.',
      'auth/weak-password': 'La nueva contraseña es demasiado débil. Usa al menos 6 caracteres.',
      'auth/requires-recent-login': 'Por seguridad, cierra sesión, vuelve a iniciarla y repite el proceso.',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Espera unos minutos e inténtalo de nuevo.',
      'auth/network-request-failed': 'Error de red. Comprueba tu conexión a internet.',
      'auth/popup-closed-by-user': 'Cancelaste la verificación con Google. Inténtalo de nuevo.',
      'auth/user-mismatch': 'La cuenta de Google no coincide con la sesión actual.',
    };
    return errores[codigo] ?? 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }


}
