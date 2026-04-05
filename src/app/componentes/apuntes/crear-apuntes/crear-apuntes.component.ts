import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApunteService } from '../../../services/apuntes.service';
import { AuthService } from '../../../services/auth.service';
import { Route, Router } from '@angular/router';

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
  userId: string | null = null;
  
  mensajeFeedback: string | null = null;
  tipoFeedback: 'success' | 'danger' | 'info' = 'info';

  datosApunte = {
    titulo: '',
    categoria: 'matematicas' // Valor por defecto para evitar errores
  };

  categorias = [
    { valor: 'matematicas', nombre: 'Matemáticas' },
    { valor: 'ciencias', nombre: 'Ciencias' },
    { valor: 'ingles', nombre: 'Inglés' },
    { valor: 'historia', nombre: 'Historia' },
    { valor: 'tecnologia', nombre: 'Tecnología' }
  ];

  constructor(
    private apunteService: ApunteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtenemos el UID del usuario logueado en Firebase
    this.authService.getUserAuthenticated().subscribe({
      next: (user: any) => {
        if (user) {
          this.userId = user.uid;
        } else {
          this.mostrarMensaje('Debes iniciar sesión para crear apuntes', 'danger');
          // Opcional: this.router.navigate(['/login']);
        }
      },
      error: (err: any) => console.error('Error obteniendo auth', err)
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      this.mostrarMensaje('Archivo seleccionado: ' + file.name, 'info');
    }
  }

  crearApuntes(): void {
    // Validaciones previas
    if (!this.userId) {
      this.mostrarMensaje('Usuario no identificado. Reintenta el login.', 'danger');
      return;
    }

    if (!this.archivoSeleccionado || !this.datosApunte.titulo) {
      this.mostrarMensaje('Rellena el título y selecciona una imagen.', 'danger');
      return;
    }

    this.cargando = true;
    this.mensajeFeedback = 'Subiendo imagen a ImgBB...';
    this.tipoFeedback = 'info';

    // 1. Subida a ImgBB
    this.apunteService.subirAImgBB(this.archivoSeleccionado).subscribe({
      next: (resImgBB: any) => {
        const urlDirecta = resImgBB.data.url;
        this.mensajeFeedback = 'Imagen lista. Digitalizando con IA...';

        // 2. Envío a Java (Pasando los 4 argumentos: titulo, url, userId, categoria)
        this.apunteService.digitalizarEnBackend(
          this.datosApunte.titulo, 
          urlDirecta, 
          this.userId!, 
          this.datosApunte.categoria
        ).subscribe({
          next: (resBackend: any) => {
            this.cargando = false;
            this.mostrarMensaje('¡Apunte creado y digitalizado con éxito!', 'success');
            setTimeout(() => this.router.navigate(['/componentes/apuntes']), 2000);
          },
          error: (err: any) => {
            this.cargando = false;
            this.mostrarMensaje('Error en el servidor de Java (IA).', 'danger');
            console.error(err);
          }
        });
      },
      error: (err: any) => {
        this.cargando = false;
        this.mostrarMensaje('Error al subir a ImgBB. Revisa tu API Key.', 'danger');
      }
    });
  }

  mostrarMensaje(texto: string, tipo: 'success' | 'danger' | 'info'): void {
    this.mensajeFeedback = texto;
    this.tipoFeedback = tipo;
    if (tipo === 'success') {
      setTimeout(() => this.mensajeFeedback = null, 5000);
    }
  }
  limpiarFormulario(): void {
    this.datosApunte = {
      titulo: '',
      categoria: 'matematicas'
    };
    this.archivoSeleccionado = null;
    this.mensajeFeedback = null;
    
    // Esto es para limpiar el input de tipo file en el HTML
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}