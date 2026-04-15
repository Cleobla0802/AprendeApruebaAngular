import { Component } from '@angular/core';
import { ApunteService } from '../../../services/apuntes.service';
import { ResumenesService } from '../../../services/resumenes.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  private apiBackend = 'https://api-aprende-aprueba-production.up.railway.app/api/tests/generar';

  constructor(
    private apunteService: ApunteService,
    private resumenService: ResumenesService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getUserAuthenticated().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.cargarDatos();
      }
    });
  }

  cargarDatos() {
    this.cargando = true;
    // Cargamos ambos simultáneamente
    this.apunteService.listarApuntesPorUsuario(this.userId).subscribe(apuntes => {
      this.listaApuntes = apuntes;
      this.resumenService.getResumenesByUser(this.userId).subscribe(resumenes => {
        this.listaResumenes = resumenes;
        this.cargando = false;
      });
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

    const payload = {
      contenido: this.seleccionado.contenido,
      userId: this.userId,
      titulo: this.seleccionado.titulo,
      categoria: this.seleccionado.categoria
    };

    // Llamada a tu controlador de Spring Boot
    this.http.post<any>(this.apiBackend, payload)
      .subscribe({
        next: (testGenerado) => {
          this.generando = false;
          // Navegamos al componente de realizar el test pasando el ID
          this.router.navigate(['/componentes/tests/realizar-test', testGenerado.id]);
        },
        error: (err) => {
          console.error("Error al generar test", err);
          this.generando = false;
          alert("Hubo un error con la IA al generar el test.");
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
