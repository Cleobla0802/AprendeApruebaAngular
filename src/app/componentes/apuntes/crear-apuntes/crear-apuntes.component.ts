import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApunteService } from '../../../services/apuntes.service';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Apunte } from '../../../models/apunte.model';

@Component({
  selector: 'app-crear-apuntes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
    { valor: 'matematicas', nombre: 'Matematicas' },
    { valor: 'ciencias', nombre: 'Ciencias' },
    { valor: 'ingles', nombre: 'Ingles' },
    { valor: 'historia', nombre: 'Historia' },
    { valor: 'tecnologia', nombre: 'Tecnologia' }
  ];

  constructor(
    private apunteService: ApunteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getUserAuthenticated().subscribe({
      next: (user) => {
        if (user) this.userId = user.uid;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
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
      this.mostrarMensaje('Formato no compatible. Arrastra o sube solo imagenes.', 'danger');
      return;
    }

    this.archivoSeleccionado = file;
    this.mostrarMensaje(`Imagen seleccionada: ${file.name}`, 'info');
  }

  async crearApuntes(): Promise<void> {
    if (!this.userId || !this.archivoSeleccionado || !this.datosApunte.titulo.trim()) return;

    this.cargando = true;
    this.mensajeFeedback = null;

    const inicio = performance.now();
    const archivoParaSubir = await this.comprimirImagen(this.archivoSeleccionado);

    const apunteInicial: Apunte = {
      titulo: this.datosApunte.titulo.trim(),
      descripcion: this.datosApunte.descripcion.trim(),
      contenido: 'Generando sus apuntes, espere...',
      estado: 'generando',
      categoria: this.datosApunte.categoria,
      userId: this.userId,
      fecha: new Date().toISOString()
    };

    this.apunteService.guardarApunte(apunteInicial).subscribe({
      next: (apunteGuardado: any) => {
        const idApunte = apunteGuardado.key;

        console.info('[Apuntes] Apunte inicial guardado', {
          idApunte,
          ms: Math.round(performance.now() - inicio),
          kbImagenComprimida: Math.round(archivoParaSubir.size / 1024)
        });

        this.cargando = false;
        this.mostrarMensaje('Apunte creado. Digitalizando en segundo plano...', 'success');
        setTimeout(() => this.router.navigate(['/componentes/apuntes']), 1000);

        this.digitalizarApunte(idApunte, archivoParaSubir, inicio);
      },
      error: () => {
        this.cargando = false;
        this.mostrarMensaje('Error al guardar en Firebase.', 'danger');
      }
    });
  }

  private digitalizarApunte(idApunte: string, archivo: File, inicio: number): void {
    this.apunteService.digitalizarArchivoEnBackend(
      archivo,
      this.datosApunte.titulo.trim(),
      this.userId!,
      this.datosApunte.categoria
    ).subscribe({
      next: (respuestaRaw: string) => {
        console.info('[Apuntes] Digitalizacion directa completada', {
          idApunte,
          msTotal: Math.round(performance.now() - inicio)
        });
        this.guardarResultadoDigitalizacion(idApunte, respuestaRaw);
      },
      error: () => {
        console.warn('[Apuntes] Digitalizacion directa fallida', {
          idApunte,
          ms: Math.round(performance.now() - inicio)
        });
        this.apunteService.actualizarContenidoApunte(
          idApunte,
          'Error al digitalizar. Edita el contenido manualmente.',
          'error'
        ).subscribe();
      }
    });
  }

  private guardarResultadoDigitalizacion(idApunte: string, respuestaRaw: string): void {
    const contenidoFinal = this.extraerTextoDigitalizado(respuestaRaw).trim();
    const estado = contenidoFinal ? 'listo' : 'error';
    this.apunteService.actualizarContenidoApunte(
      idApunte,
      contenidoFinal || 'La IA no pudo digitalizar el apunte. Edita el contenido manualmente.',
      estado
    ).subscribe();
  }

  private extraerTextoDigitalizado(respuestaRaw: string): string {
    let contenidoFinal = respuestaRaw;

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
        contenidoFinal = typeof primeraCapa === 'string' ? primeraCapa : JSON.stringify(primeraCapa, null, 2);
      }
    } catch {
      if (respuestaRaw.includes('<body')) {
        const match = respuestaRaw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        if (match && match[1]) contenidoFinal = match[1].trim();
      }
    }

    return contenidoFinal;
  }

  private async comprimirImagen(file: File): Promise<File> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxDimension = 1400;
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
            0.7
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
