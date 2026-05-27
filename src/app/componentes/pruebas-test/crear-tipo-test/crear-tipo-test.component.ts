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
import { Apunte } from '../../../models/apunte.model';
import { Resumen } from '../../../models/resumen.model';
import { Pregunta, Test } from '../../../models/pruebas.model';
import { environment } from '../../../../environments/environment';
import { crearHashContenido, prepararContenidoParaIA } from '../../../shared/ia-text.util';

type MaterialTipo = 'apuntes' | 'resumenes';
type MaterialSeleccionable = Apunte | Resumen;

@Component({
  selector: 'app-crear-tipo-test',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './crear-tipo-test.component.html',
  styleUrl: './crear-tipo-test.component.scss'
})
export class CrearTipoTestComponent {
  listaApuntes: Apunte[] = [];
  listaResumenes: Resumen[] = [];
  testsExistentes: Test[] = [];

  tabActiva: MaterialTipo = 'apuntes';
  seleccionado: MaterialSeleccionable | null = null;
  cargando = true;
  generando = false;
  testCreado = false;
  userId = '';
  tituloPersonalizado = '';
  cantidadPreguntas = 10;
  readonly maxTituloLength = 30;

  notif = { show: false, msg: '', type: 'success' as 'success' | 'danger' | 'warning' | 'info' };
  private readonly limiteContenidoIA = environment.ia.limiteTest;
  private readonly textoEnProceso = 'Generando sus apuntes, espere...';
  private readonly apiBackend = environment.api.testsGenerar;

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

  cargarDatos(): void {
    this.cargando = true;
    combineLatest([
      this.apunteService.listarApuntesPorUsuario(this.userId),
      this.resumenService.listarResumenesPorUsuario(this.userId),
      this.pruebasService.listarTestsPorUsuario(this.userId)
    ]).subscribe({
      next: ([apuntes, resumenes, tests]) => {
        this.listaApuntes = apuntes;
        this.listaResumenes = resumenes;
        this.testsExistentes = tests;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar material', err);
        this.cargando = false;
      }
    });
  }

  getListaActual(): MaterialSeleccionable[] {
    return this.tabActiva === 'apuntes' ? this.listaApuntes : this.listaResumenes;
  }

  seleccionar(item: MaterialSeleccionable): void {
    if (this.estaEnProceso(item)) {
      this.showMsg('Este elemento todavia se esta procesando, espera a que termine', 'warning');
      return;
    }

    this.seleccionado = item;
    this.tituloPersonalizado = (item?.titulo || '').slice(0, this.maxTituloLength);
  }

  generarTest(): void {
    if (!this.seleccionado) return;

    if (this.estaEnProceso(this.seleccionado)) {
      this.showMsg('El material seleccionado todavia se esta procesando.', 'warning');
      return;
    }

    if (!this.tituloPersonalizado.trim()) {
      this.showMsg('Escribe un titulo para el tipo test.', 'warning');
      return;
    }

    if (![5, 10, 15].includes(this.cantidadPreguntas)) this.cantidadPreguntas = 10;

    const textoOriginal = this.obtenerContenidoMaterial(this.seleccionado);
    const textoAProcesar = prepararContenidoParaIA(textoOriginal, this.limiteContenidoIA);

    if (!textoAProcesar) {
      this.showMsg('El material seleccionado no tiene contenido suficiente.', 'warning');
      return;
    }

    const contenidoHash = crearHashContenido(textoAProcesar);
    const testCacheado = this.buscarTestCacheado(contenidoHash);

    if (testCacheado) {
      this.crearTestDesdeCache(testCacheado, contenidoHash);
      return;
    }

    this.crearTestConIA(textoOriginal, textoAProcesar, contenidoHash);
  }

  private crearTestDesdeCache(testCacheado: Test, contenidoHash: string): void {
    const preguntas = testCacheado.preguntas.slice(0, this.cantidadPreguntas);
    const testFinal: Test = {
      userId: this.userId,
      titulo: this.tituloPersonalizado.trim(),
      categoria: this.seleccionado?.categoria || 'general',
      descripcion: this.obtenerDescripcionMaterial(this.seleccionado),
      preguntas,
      estado: 'listo',
      fecha: new Date().getTime(),
      completado: false,
      ultimaNota: 0,
      cantidadPreguntas: this.cantidadPreguntas,
      materialTipo: this.tabActiva,
      materialId: this.seleccionado?.id || '',
      contenidoHash
    };

    this.generando = true;
    this.pruebasService.crearTest(testFinal).subscribe({
      next: (testGuardado) => {
        this.generando = false;
        this.testsExistentes = [...this.testsExistentes, testGuardado];
        this.testCreado = true;
        setTimeout(() => this.router.navigate(['/componentes/pruebas-test']), 2500);
      },
      error: () => this.handleError('Error al reutilizar el test guardado')
    });
  }

  private crearTestConIA(textoOriginal: string, textoAProcesar: string, contenidoHash: string): void {
    this.generando = true;
    const inicioGeneracion = performance.now();

    console.info('[TipoTest] Inicio de generacion', {
      cantidadPreguntas: this.cantidadPreguntas,
      tipoMaterial: this.tabActiva,
      caracteresOriginales: textoOriginal.length,
      caracteresEnviados: textoAProcesar.length
    });

    const testInicial: Test = {
      userId: this.userId,
      titulo: this.tituloPersonalizado.trim(),
      categoria: this.seleccionado?.categoria || 'general',
      descripcion: this.obtenerDescripcionMaterial(this.seleccionado),
      preguntas: [],
      estado: 'generando',
      fecha: new Date().getTime(),
      completado: false,
      ultimaNota: 0,
      cantidadPreguntas: this.cantidadPreguntas,
      materialTipo: this.tabActiva,
      materialId: this.seleccionado?.id || '',
      contenidoHash
    };

    this.pruebasService.crearTest(testInicial).subscribe({
      next: (testGuardado) => {
        const idTest = testGuardado.id;
        if (!idTest) {
          this.handleError('No se pudo crear el test');
          return;
        }

        this.testsExistentes = [...this.testsExistentes, testGuardado];

        console.info('[TipoTest] Test inicial guardado en Firebase', {
          idTest,
          ms: Math.round(performance.now() - inicioGeneracion)
        });

        this.generando = false;
        this.testCreado = true;
        setTimeout(() => this.router.navigate(['/componentes/pruebas-test']), 2500);

        const payload = {
          contenido: textoAProcesar,
          userId: this.userId,
          titulo: this.tituloPersonalizado.trim(),
          categoria: this.seleccionado?.categoria || 'general',
          cantidadPreguntas: this.cantidadPreguntas
        };
        const inicioBackend = performance.now();

        this.http.post<{ preguntas?: Pregunta[] }>(this.apiBackend, payload).subscribe({
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
            this.pruebasService.actualizarPreguntasTest(idTest, preguntas, estado).subscribe();
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

  private buscarTestCacheado(contenidoHash: string): Test | undefined {
    return this.testsExistentes.find(test =>
      test.estado === 'listo' &&
      test.materialTipo === this.tabActiva &&
      test.materialId === this.seleccionado?.id &&
      test.contenidoHash === contenidoHash &&
      test.cantidadPreguntas === this.cantidadPreguntas &&
      Array.isArray(test.preguntas) &&
      test.preguntas.length >= this.cantidadPreguntas
    );
  }

  private obtenerContenidoMaterial(item: MaterialSeleccionable | null): string {
    if (!item) return '';
    return this.tabActiva === 'apuntes'
      ? (item as Apunte).contenido
      : (item as Resumen).resumenTexto;
  }

  private obtenerDescripcionMaterial(item: MaterialSeleccionable | null): string {
    return item?.descripcion || '';
  }

  showMsg(msg: string, type: 'success' | 'danger' | 'warning' | 'info'): void {
    this.notif = { show: true, msg, type };
    setTimeout(() => this.notif.show = false, 3000);
  }

  handleError(msg: string): void {
    this.generando = false;
    this.showMsg(msg, 'danger');
  }

  estaEnProceso(item: MaterialSeleccionable | null): boolean {
    if (!item) return false;

    if (item.estado === 'generando') return true;
    const contenido = this.obtenerContenidoMaterial(item);
    return contenido === this.textoEnProceso;
  }

  getDescripcionItem(item: MaterialSeleccionable): string {
    if (this.estaEnProceso(item)) {
      return this.tabActiva === 'apuntes'
        ? 'Apunte en proceso de digitalizacion...'
        : 'Resumen en proceso de generacion...';
    }

    const contenido = this.obtenerContenidoMaterial(item);
    return item.descripcion || (contenido ? `${contenido.slice(0, 100)}...` : 'Sin descripcion disponible.');
  }

  trackById(index: number, item: MaterialSeleccionable): string {
    return item?.id || item?.titulo || index.toString();
  }

  getBgColor(categoria: string): string {
    if (!categoria) return 'secondary';
    const colores: Record<string, string> = {
      'matematicas': 'primary',
      'ciencias': 'success',
      'ingles': 'info',
      'historia': 'warning',
      'tecnologia': 'danger'
    };
    return colores[categoria.toLowerCase()] || 'secondary';
  }
}
