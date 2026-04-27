import { Component } from '@angular/core';
import { ApunteService } from '../../../services/apuntes.service';
import { ResumenesService } from '../../../services/resumenes.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PruebasService } from '../../../services/pruebas.service';

@Component({
  selector: 'app-crear-tipo-test',
  imports: [CommonModule],
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
  
  notif = { show: false, msg: '', type: 'success' as 'success' | 'danger' | 'warning' | 'info' };

  private apiBackend = 'https://api-aprende-aprueba-1.onrender.com/api/tests/generar';

  constructor(
    private apunteService: ApunteService,
    private resumenService: ResumenesService,
    private pruebasService: PruebasService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

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
    this.seleccionado = item;
  }

  generarTest() {
    if (!this.seleccionado) return;
    this.generando = true;
    this.notif.show = false;

    // Adaptación dinámica del contenido:
    const textoAProcesar = this.tabActiva === 'apuntes' 
      ? this.seleccionado.contenido 
      : this.seleccionado.resumenTexto;

    const payload = {
      contenido: textoAProcesar,
      userId: this.userId,
      titulo: this.seleccionado.titulo,
      categoria: this.seleccionado.categoria
    };

    // 1. Pedimos las preguntas a la IA (Backend Java)
    this.http.post<any>(this.apiBackend, payload).subscribe({
      next: (testDeIA) => {
        
        // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
        // El objeto testDeIA viene con las preguntas, pero no con la descripción.
        // Se la asignamos manualmente del material origen (apunte o resumen).
        testDeIA.descripcion = this.seleccionado.descripcion || '';

        // 2. Guardamos el test completo en Firebase
        this.pruebasService.crearTest(testDeIA).subscribe({
          next: (testGuardado) => {
            this.generando = false;
            if (testGuardado && testGuardado.id) {
              this.showMsg('¡Test generado con éxito!', 'success');
              setTimeout(() => {
                this.router.navigate(['/componentes/pruebas-test/realizar-test', testGuardado.id]);
              }, 1500);
            }
          },
          error: () => this.handleError('Error al guardar el test')
        });
      },
      error: () => this.handleError('La IA no pudo generar las preguntas')
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