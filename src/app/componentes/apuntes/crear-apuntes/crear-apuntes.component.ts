import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApunteService } from '../../../services/apuntes.service';

@Component({
  selector: 'app-crear-apuntes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-apuntes.component.html',
  styleUrl: './crear-apuntes.component.scss'
})
export class CrearApuntesComponent {
  // Estados de la interfaz
  cargando = false;
  archivoSeleccionado: File | null = null;
  
  // Feedback para el usuario (reemplaza a los alert)
  mensajeFeedback: string | null = null;
  tipoFeedback: 'success' | 'danger' | 'info' = 'info';

  datosApunte = {
    titulo: ''
  };

  categorias = [
    { valor: 'matematicas', nombre: 'Matemáticas' },
    { valor: 'ciencias', nombre: 'Ciencias' },
    { valor: 'ingles', nombre: 'Inglés' },
    { valor: 'historia', nombre: 'Historia' },
    { valor: 'tecnologia', nombre: 'Tecnología' }
  ];

  constructor(private apunteService: ApunteService) {}

  onFileSelected(event: any) {
    this.archivoSeleccionado = event.target.files[0];
    this.mostrarMensaje('Archivo seleccionado: ' + this.archivoSeleccionado?.name, 'info');
  }

  crearApuntes() {
    if (!this.archivoSeleccionado || !this.datosApunte.titulo) {
      this.mostrarMensaje('Por favor, rellena el título y selecciona una imagen.', 'danger');
      return;
    }

    this.cargando = true;
    this.mensajeFeedback = 'Subiendo imagen a ImgBB...';
    this.tipoFeedback = 'info';

    // 1. Subida a ImgBB
    this.apunteService.subirAImgBB(this.archivoSeleccionado).subscribe({
      next: (resImgBB) => {
        const urlDirecta = resImgBB.data.url;
        this.mensajeFeedback = 'Imagen lista. La IA está procesando el texto...';

        // 2. Envío a tu Backend de Java
        this.apunteService.digitalizarEnBackend(this.datosApunte.titulo, urlDirecta).subscribe({
          next: (textoIA) => {
            this.cargando = false;
            this.mostrarMensaje('¡Apunte creado y digitalizado con éxito!', 'success');
            this.limpiarFormulario();
          },
          error: (err) => {
            this.cargando = false;
            this.mostrarMensaje('Error al procesar en el servidor de Java.', 'danger');
          }
        });
      },
      error: (err) => {
        this.cargando = false;
        this.mostrarMensaje('Error al subir la imagen a ImgBB. Revisa tu API Key.', 'danger');
      }
    });
  }

  // Método para gestionar el feedback visual
  mostrarMensaje(texto: string, tipo: 'success' | 'danger' | 'info') {
    this.mensajeFeedback = texto;
    this.tipoFeedback = tipo;
    
    // Si es un éxito, ocultamos el mensaje tras 5 segundos
    if (tipo === 'success') {
      setTimeout(() => this.mensajeFeedback = null, 5000);
    }
  }

  limpiarFormulario() {
    this.datosApunte.titulo = '';
    this.archivoSeleccionado = null;
  }
}