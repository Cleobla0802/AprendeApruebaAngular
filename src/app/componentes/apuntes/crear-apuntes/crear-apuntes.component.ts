import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApunteService } from '../../../services/apuntes.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

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
    if (!file) return;
    this.procesarArchivo(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    this.procesarArchivo(file);
  }

  private procesarArchivo(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.archivoSeleccionado = null;
      this.mostrarMensaje('Formato no compatible. Arrastra o sube solo imágenes.', 'danger');
      return;
    }

    this.archivoSeleccionado = file;
    this.mostrarMensaje(`Imagen seleccionada: ${file.name}`, 'info');
  }

  async crearApuntes(): Promise<void> {
    if (!this.userId || !this.archivoSeleccionado || !this.datosApunte.titulo) return;

    this.cargando = true;
    this.mensajeFeedback = null; 

    const archivoParaSubir = await this.comprimirImagen(this.archivoSeleccionado);

    this.apunteService.subirAImgBB(archivoParaSubir).subscribe({
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
            this.guardarApunteFinal(contenidoFinal);
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

  private guardarApunteFinal(contenidoFinal: string): void {
    const apunteParaFirebase = {
      titulo: this.datosApunte.titulo,
      descripcion: this.datosApunte.descripcion,
      contenido: contenidoFinal,
      categoria: this.datosApunte.categoria,
      userId: this.userId,
      fecha: new Date().toISOString()
    };

    this.apunteService.guardarApunte(apunteParaFirebase).subscribe({
      next: () => {
        this.mostrarMensaje('¡Apunte creado con éxito!', 'success');
        setTimeout(() => {
          this.cargando = false;
          this.router.navigate(['/componentes/apuntes']);
        }, 1500);
      },
      error: () => {
        this.cargando = false;
        this.mostrarMensaje('Error al guardar en Firebase.', 'danger');
      }
    });
  }

  private async comprimirImagen(file: File): Promise<File> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxDimension = 1600;
          const ratio = Math.min(maxDimension / img.width, maxDimension / img.height, 1);
          const width = Math.round(img.width * ratio);
          const height = Math.round(img.height * ratio);

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
            },
            'image/jpeg',
            0.75
          );
        };
        img.onerror = () => resolve(file);
        img.src = reader.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
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