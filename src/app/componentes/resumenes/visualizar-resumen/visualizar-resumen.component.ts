import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResumenesService } from '../../../services/resumenes.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visualizar-resumen',
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizar-resumen.component.html',
  styleUrl: './visualizar-resumen.component.scss'
})
export class VisualizarResumenComponent implements OnInit {
resumen: any = null;
  resumenId: string = '';
  userId: string = '';
  cargando = true;
  guardando = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private resumenService: ResumenesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.resumenId = this.route.snapshot.paramMap.get('id') || '';
    
    this.authService.getUserAuthenticated().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.cargarResumen();
      }
    });
  }

cargarResumen() {
  console.log("Buscando resumen con ID:", this.resumenId, "para el usuario:", this.userId);
  this.resumenService.getResumenById(this.userId, this.resumenId).subscribe(data => {
    console.log("Datos recibidos de Firebase:", data);
    this.resumen = data;
    this.cargando = false;
    
    if (!data) {
      console.warn("Ojo: No se encontró ningún resumen en esa ruta de Firebase.");
    }
  });
}

  guardarCambios() {
    if (!this.resumen) return;
    
    this.guardando = true;
    this.resumenService.actualizarResumen(this.userId, this.resumenId, this.resumen)
      .subscribe({
        next: () => {
          this.guardando = false;
          // Opcional: podrías redirigir o mostrar un pequeño check temporal en el HTML
        },
        error: (err) => {
          console.error("Error al guardar:", err);
          this.guardando = false;
        }
      });
  }

  // Método auxiliar para contar palabras
  get contarPalabras(): number {
    if (!this.resumen?.contenido) return 0;
    return this.resumen.contenido.trim().split(/\s+/).length;
  }
}
