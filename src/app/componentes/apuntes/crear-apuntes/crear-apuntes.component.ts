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
  cargando = false;
  archivoSeleccionado: File | null = null;
  userId: string | null = null;
  
  mensajeFeedback: string | null = null;
  tipoFeedback: 'success' | 'danger' | 'info' = 'info';

  datosApunte = {
    titulo: '',
    categoria: 'matematicas',
    descripcion: ''
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
    this.authService.getUserAuthenticated().subscribe({
      next: (user: any) => {
        if (user) this.userId = user.uid;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      this.mensajeFeedback = null;
    }
  }

  crearApuntes(): void {
    if (!this.userId || !this.archivoSeleccionado || !this.datosApunte.titulo) return;

    this.cargando = true;
    this.mensajeFeedback = null; 

    this.apunteService.subirAImgBB(this.archivoSeleccionado).subscribe({
      next: (resImgBB: any) => {
        const urlDirecta = resImgBB.data.url;

        this.apunteService.digitalizarEnBackend(
          this.datosApunte.titulo, 
          urlDirecta, 
          this.userId!, 
          this.datosApunte.categoria
        ).subscribe({
          next: (respuestaRaw: string) => {
            let contenidoFinal: string = respuestaRaw;

            // --- Lógica de limpieza (se mantiene igual) ---
            try {
              const primeraCapa = JSON.parse(respuestaRaw);
              if (primeraCapa && primeraCapa.textoIA) {
                try {
                  const segundaCapa = JSON.parse(primeraCapa.textoIA);
                  contenidoFinal = typeof segundaCapa === 'string' ? segundaCapa : JSON.stringify(segundaCapa, null, 2);
                } catch {
                  contenidoFinal = primeraCapa.textoIA;
                }
              } else {
                contenidoFinal = JSON.stringify(primeraCapa, null, 2);
              }
            } catch (e) {
              if (respuestaRaw.includes('<body')) {
                const match = respuestaRaw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
                if (match && match[1]) {
                  contenidoFinal = match[1].trim();
                }
              }
            }

            // --- Guardado con DESCRIPCIÓN ---
            const apunteParaFirebase = {
              titulo: this.datosApunte.titulo,
              descripcion: this.datosApunte.descripcion, // Nuevo campo
              contenido: contenidoFinal,
              categoria: this.datosApunte.categoria,
              userId: this.userId,
              fecha: new Date().toISOString()
            };

            this.apunteService.guardarApunte(apunteParaFirebase).subscribe({
              next: () => {
                this.cargando = false;
                this.mostrarMensaje('¡Apunte creado con éxito!', 'success');
                setTimeout(() => this.router.navigate(['/componentes/apuntes']), 1500);
              },
              error: () => {
                this.cargando = false;
                this.mostrarMensaje('Error al guardar en Firebase.', 'danger');
              }
            });
          },
          error: () => {
            this.cargando = false;
            this.mostrarMensaje('Error en el servidor de IA.', 'danger');
          }
        });
      },
      error: () => {
        this.cargando = false;
        this.mostrarMensaje('Error al subir la imagen.', 'danger');
      }
    });
  }

  mostrarMensaje(texto: string, tipo: 'success' | 'danger' | 'info'): void {
    this.mensajeFeedback = texto;
    this.tipoFeedback = tipo;
  }

  limpiarFormulario(): void {
    this.datosApunte = { titulo: '', categoria: 'matematicas', descripcion: '' };
    this.archivoSeleccionado = null;
    this.mensajeFeedback = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}