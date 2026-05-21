import { Component } from '@angular/core';
import { ApunteService } from '../../../services/apuntes.service';
import { ResumenesService } from '../../../services/resumenes.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PruebasService } from '../../../services/pruebas.service';
import { FormsModule } from '@angular/forms';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-crear-tipo-test',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './crear-tipo-test.component.html',
  styleUrl: './crear-tipo-test.component.scss'
})
export class CrearTipoTestComponent {
  listaApuntes: any[] = [];
  listaResumenes: any[] = [];

  tabActiva: 'apuntes' | 'resumenes' = 'apuntes';
  seleccionado: any = null;
  cargando = true;
  generando = false;
  userId = '';
  tituloPersonalizado = '';
  cantidadPreguntas = 10;
  readonly maxTituloLength = 30;

  notif = { show: false, msg: '', type: 'success' as 'success' | 'danger' | 'warning' | 'info' };
  private readonly limiteContenidoIA = 12000;
  private readonly textoApunteEnProceso = 'Generando sus apuntes, espere...';
  private readonly textoResumenEnProceso = 'Generando sus apuntes, espere...';

  private apiBackend = 'https://api-aprende-aprueba-1.onrender.com/api/tests/generar';

  constructor(
    private apunteService: ApunteService,
    private resumenService: ResumenesService,
    private pruebasService: PruebasService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.getUserAuthenticated().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.cargarDatos();
      } else {
        this.cargando = false;
      }
    });
  }

  cargarDatos() {
    this.cargando = true;
    combineLatest([
      this.apunteService.listarApuntesPorUsuario(this.userId),
      this.resumenService.listarResumenesPorUsuario(this.userId)
    ]).subscribe({
      next: ([apuntes, resumenes]) => {
        this.listaApuntes = apuntes;
        this.listaResumenes = resumenes;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar material', err);
        this.cargando = false;
      }
    });
  }

  getListaActual() {
    return this.tabActiva === 'apuntes' ? this.listaApuntes : this.listaResumenes;
  }

  seleccionar(item: any) {
    if (this.estaEnProceso(item)) {
      this.showMsg('Este elemento todavía se está procesando, espera a que termine', 'warning');
      return;
    }

    this.seleccionado = item;
    this.tituloPersonalizado = (item?.titulo || '').slice(0, this.maxTituloLength);
  }

  generarTest() {
    if (!this.seleccionado) return;

    if (this.estaEnProceso(this.seleccionado)) {
      this.showMsg('El material seleccionado todavía se está procesando.', 'warning');
      return;
    }

    if (!this.tituloPersonalizado.trim()) {
      this.showMsg('Escribe un título para el tipo test.', 'warning');
      return;
    }

    if (![5, 10, 15, 20].includes(this.cantidadPreguntas)) this.cantidadPreguntas = 10;
    this.generando = true;
    const inicioGeneracion = performance.now();

    const textoOriginal = this.tabActiva === 'apuntes'
      ? this.seleccionado.contenido
      : this.seleccionado.resumenTexto;
    const textoAProcesar = this.prepararContenidoParaIA(textoOriginal);
    console.info('[TipoTest] Inicio de generacion', {
      cantidadPreguntas: this.cantidadPreguntas,
      tipoMaterial: this.tabActiva,
      caracteresOriginales: textoOriginal?.length || 0,
      caracteresEnviados: textoAProcesar.length
    });

    const testInicial = {
      userId: this.userId,
      titulo: this.tituloPersonalizado.trim(),
      categoria: this.seleccionado.categoria,
      descripcion: this.seleccionado.descripcion || '',
      preguntas: [],
      estado: 'generando',
      fecha: new Date().getTime(),
      completado: false,
      ultimaNota: 0
    };

    this.pruebasService.crearTest(testInicial).subscribe({
      next: (testGuardado: any) => {
        const idTest = testGuardado.id;
        console.info('[TipoTest] Test inicial guardado en Firebase', {
          idTest,
          ms: Math.round(performance.now() - inicioGeneracion)
        });
        this.generando = false;
        this.showMsg('¡Test creado! Generando preguntas en segundo plano...', 'success');
        setTimeout(() => this.router.navigate(['/componentes/pruebas-test']), 1500);

        const payload = {
          contenido: textoAProcesar,
          userId: this.userId,
          titulo: this.tituloPersonalizado.trim(),
          categoria: this.seleccionado.categoria,
          cantidadPreguntas: this.cantidadPreguntas
        };
        const inicioBackend = performance.now();

        this.http.post<any>(this.apiBackend, payload).subscribe({
          next: (testDeIA) => {
            const preguntas = (testDeIA.preguntas || []).slice(0, this.cantidadPreguntas);
            const estado = preguntas.length > 0 ? 'listo' : 'error';
            console.info('[TipoTest] Backend IA respondio', {
              preguntasRecibidas: testDeIA.preguntas?.length || 0,
              preguntasGuardadas: preguntas.length,
              estado,
              msBackend: Math.round(performance.now() - inicioBackend),
              msTotal: Math.round(performance.now() - inicioGeneracion)
            });
            const inicioUpdate = performance.now();
            this.pruebasService.actualizarPreguntasTest(idTest, preguntas, estado).subscribe({
              next: () => console.info('[TipoTest] Preguntas actualizadas en Firebase', {
                idTest,
                estado,
                msUpdate: Math.round(performance.now() - inicioUpdate),
                msTotal: Math.round(performance.now() - inicioGeneracion)
              })
            });
          },
          error: () => {
            console.warn('[TipoTest] Error del backend IA', {
              msBackend: Math.round(performance.now() - inicioBackend),
              msTotal: Math.round(performance.now() - inicioGeneracion)
            });
            this.pruebasService.actualizarPreguntasTest(idTest, [], 'error').subscribe();
          }
        });
      },
      error: () => this.handleError('Error al guardar el test')
    });
  }

  showMsg(msg: string, type: 'success' | 'danger' | 'warning' | 'info') {
    this.notif = { show: true, msg, type };
    setTimeout(() => this.notif.show = false, 3000);
  }

  handleError(msg: string) {
    this.generando = false;
    this.showMsg(msg, 'danger');
  }

  private prepararContenidoParaIA(contenido: string): string {
    if (!contenido) return '';
    return contenido.length > this.limiteContenidoIA
      ? contenido.slice(0, this.limiteContenidoIA)
      : contenido;
  }

  estaEnProceso(item: any): boolean {
    if (!item) return false;

    if (this.tabActiva === 'apuntes') {
      return item.contenido === this.textoApunteEnProceso;
    }

    return item.resumenTexto === this.textoResumenEnProceso;
  }

  getDescripcionItem(item: any): string {
    if (this.estaEnProceso(item)) {
      return this.tabActiva === 'apuntes'
        ? 'Apunte en proceso de digitalización...'
        : 'Resumen en proceso de generación...';
    }

    const contenido = this.tabActiva === 'apuntes' ? item.contenido : item.resumenTexto;
    return item.descripcion || (contenido ? `${contenido.slice(0, 100)}...` : 'Sin descripción disponible.');
  }

  trackById(index: number, item: any): string {
    return item?.id || item?.titulo || index.toString();
  }

  getBgColor(categoria: string): string {
    if (!categoria) return 'secondary';
    const colores: any = {
      'matematicas': 'primary',
      'ciencias': 'success',
      'ingles': 'info',
      'historia': 'warning',
      'tecnologia': 'danger'
    };
    return colores[categoria.toLowerCase()] || 'secondary';
  }
}
