import { Component } from '@angular/core';
import { ApunteService } from '../../../services/apuntes.service';
import { ResumenesService } from '../../../services/resumenes.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PruebasService } from '../../../services/pruebas.service';
import { FormsModule } from '@angular/forms';

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
  userId: string = '';
  tituloPersonalizado = '';
  cantidadPreguntas = 10;
  readonly maxTituloLength = 30;

  notif = { show: false, msg: '', type: 'success' as 'success' | 'danger' | 'warning' | 'info' };
  private readonly limiteContenidoIA = 12000;

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
    this.apunteService.listarApuntesPorUsuario(this.userId).subscribe({
      next: (apuntes: any[]) => {
        this.listaApuntes = apuntes;
        this.resumenService.listarResumenesPorUsuario(this.userId).subscribe({
          next: (resumenes: any[]) => {
            this.listaResumenes = resumenes;
            this.cargando = false;
          },
          error: (err) => {
            console.error("Error al cargar resúmenes", err);
            this.cargando = false;
          }
        });
      },
      error: (err) => {
        console.error("Error al cargar apuntes", err);
        this.cargando = false;
      }
    });
  }

  getListaActual() {
    return this.tabActiva === 'apuntes' ? this.listaApuntes : this.listaResumenes;
  }

  seleccionar(item: any) {
    const enProceso = item.contenido === 'Generando su tipo test, espere...' || 
                      item.resumenTexto === 'Generando su tipo test, espere...';
    if (enProceso) {
      this.showMsg('Este elemento todavía se está procesando, espera a que termine', 'warning');
      return;
    }
    this.seleccionado = item;
    this.tituloPersonalizado = (item?.titulo || '').slice(0, 30);
  }

  generarTest() {
    if (!this.seleccionado) return;
    if (!this.tituloPersonalizado.trim()) {
      this.showMsg('Escribe un título para el tipo test.', 'warning');
      return;
    }

    this.cantidadPreguntas = Math.min(30, Math.max(1, Math.floor(this.cantidadPreguntas || 10)));
    this.generando = true;

    const textoOriginal = this.tabActiva === 'apuntes'
      ? this.seleccionado.contenido
      : this.seleccionado.resumenTexto;
    const textoAProcesar = this.prepararContenidoParaIA(textoOriginal);

    const testInicial = {
      userId: this.userId,
      titulo: this.tituloPersonalizado.trim(),
      categoria: this.seleccionado.categoria,
      descripcion: this.seleccionado.descripcion || '',
      preguntas: [],
      fecha: new Date().getTime(),
      completado: false,
      ultimaNota: 0
    };

    this.pruebasService.crearTest(testInicial).subscribe({
      next: (testGuardado: any) => {
        const idTest = testGuardado.key;
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

        this.http.post<any>(this.apiBackend, payload).subscribe({
          next: (testDeIA) => {
            const preguntas = testDeIA.preguntas || [];
            this.pruebasService.actualizarPreguntasTest(idTest, preguntas).subscribe();
          },
          error: () => {
            this.pruebasService.actualizarPreguntasTest(idTest, []).subscribe();
          }
        });
      },
      error: () => this.handleError('Error al guardar el test')
    });
  }

  // Centralización de mensajes para ser consistente con los otros .ts
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