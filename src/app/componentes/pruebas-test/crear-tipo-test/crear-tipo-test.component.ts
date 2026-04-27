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

  // Actualizado a Render para ser consistente con tus servicios anteriores
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
    // 1. Cargamos Apuntes desde Firebase
    this.apunteService.listarApuntesPorUsuario(this.userId).subscribe({
      next: (apuntes: any[]) => { // Tipado explícito para evitar error TS7006
        this.listaApuntes = apuntes;
        
        // 2. Cargamos Resúmenes desde Firebase (usando el nuevo nombre del método)
        this.resumenService.listarResumenesPorUsuario(this.userId).subscribe({
          next: (resumenes: any[]) => {
            this.listaResumenes = resumenes;
            this.cargando = false;
          },
          error: (err: any) => {
            console.error("Error al cargar resúmenes", err);
            this.cargando = false;
          }
        });
      },
      error: (err: any) => {
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
    this.notif = { show: false, msg: '', type: 'info' };

    const payload = {
      contenido: this.seleccionado.contenido,
      userId: this.userId,
      titulo: this.seleccionado.titulo,
      categoria: this.seleccionado.categoria
    };

    // 1. Pedimos las preguntas a la IA (Java)
    this.http.post<any>(this.apiBackend, payload).subscribe({
      next: (testDeIA) => {
        // 2. Guardamos el test en Firebase para obtener un ID real
        this.pruebasService.crearTest(testDeIA).subscribe({
          next: (testGuardado) => {
            this.generando = false;
            
            // Verificamos que el ID exista antes de navegar
            if (testGuardado && testGuardado.id) {
              this.notif = { show: true, msg: '¡Test generado!', type: 'success' };
              setTimeout(() => {
                this.router.navigate(['/componentes/pruebas-test/realizar-test', testGuardado.id]);
              }, 1000);
            }
          },
          error: () => {
            this.generando = false;
            this.notif = { show: true, msg: 'Error al guardar en Firebase', type: 'danger' };
          }
        });
      },
      error: () => {
        this.generando = false;
        this.notif = { show: true, msg: 'Error al generar preguntas con IA', type: 'danger' };
      }
    });
  }

  getBgColor(categoria: string): string {
    const colores: any = {
      'matematicas': 'primary',
      'ciencias': 'success',
      'ingles': 'info',
      'historia': 'warning',
      'tecnologia': 'danger'
    };
    return colores[categoria?.toLowerCase()] || 'secondary';
  }
}
