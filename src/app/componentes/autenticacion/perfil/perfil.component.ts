import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Database, get, ref } from '@angular/fire/database';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  private authService = inject(AuthService);
  private db = inject(Database);

  usuarioActual: User | null = null;
  usernameActual = '';
  nuevoUsername = '';
  passwordActual = '';

  loadingUsername = false;
  loadingDelete = false;
  showDeleteModal = false;
  esGoogle = false;

  mensajeExito = '';
  mensajeError = '';
  errorDelete = '';

  ngOnInit() {
    this.authService.getUserAuthenticated().subscribe(user => {
      this.usuarioActual = user;
      if (user) {
        this.esGoogle = this.authService.isGoogleUser();
        get(ref(this.db, `usuarios/${user.uid}/username`)).then(snap => {
          this.usernameActual = snap.val() || user.displayName || '';
          this.nuevoUsername = this.usernameActual;
        });
      }
    });
  }

  async guardarUsername() {
    if (!this.nuevoUsername.trim() || !this.usuarioActual) return;
    this.loadingUsername = true;
    this.mensajeExito = '';
    this.mensajeError = '';
    try {
      await this.authService.saveUsername(this.usuarioActual.uid, this.nuevoUsername.trim());
      this.usernameActual = this.nuevoUsername.trim();
      this.mensajeExito = 'Nombre actualizado correctamente';
    } catch {
      this.mensajeError = 'Error al actualizar el nombre';
    } finally {
      this.loadingUsername = false;
    }
  }

  async resetPassword() {
    if (!this.usuarioActual?.email) return;
    try {
      await this.authService.resetPassword(this.usuarioActual.email);
      this.mensajeExito = 'Correo de restablecimiento enviado a ' + this.usuarioActual.email;
    } catch {
      this.mensajeError = 'Error al enviar el correo';
    }
  }

  abrirModalEliminar() {
    this.showDeleteModal = true;
    this.errorDelete = '';
    this.passwordActual = '';
  }

  cerrarModalEliminar() {
    this.showDeleteModal = false;
  }

  async confirmarEliminar() {
    this.loadingDelete = true;
    this.errorDelete = '';
    try {
      await this.authService.deleteAccount(this.esGoogle ? undefined : this.passwordActual);
    } catch (e: any) {
      this.errorDelete = e.code === 'auth/wrong-password'
        ? 'Contraseña incorrecta'
        : 'Error al eliminar la cuenta. Inténtalo de nuevo';
    } finally {
      this.loadingDelete = false;
    }
  }
}
