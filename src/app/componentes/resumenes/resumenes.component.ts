import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResumenesService } from '../../services/resumenes.service';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumenes',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './resumenes.component.html',
  styleUrl: './resumenes.component.scss'
})
export class ResumenesComponent implements OnInit {
listaResumenes: any[] = []; 
  listaResumenesOriginal: any[] = []; 
  cargando = true;
  buscarResumen: string = '';
  usuarioActual: any = null;

  // Objeto para notificaciones de Bootstrap
  notif = { 
    show: false, 
    msg: '', 
    type: 'success' as 'success' | 'danger' | 'warning' | 'info' 
  };
  mostrarModalEliminar = false;
  resumenAEliminarId: string | null = null;
  resumenAEliminarTitulo = '';

  filtrosCategorias: any = {
    matematicas: false,
    ciencias: false,
    ingles: false,
    historia: false,
    tecnologia: false
  };

  constructor(
    private resumenService: ResumenesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUserAuthenticated().subscribe(user => {
      if (user) {
        this.usuarioActual = user;
        this.obtenerResumenes(user.uid);
      } else {
        this.cargando = false;
      }
    });
  }

  obtenerResumenes(uid: string) {
    this.cargando = true;
    this.resumenService.listarResumenesPorUsuario(uid).subscribe({
      next: (data: any[]) => {
        this.listaResumenesOriginal = data;
        this.listaResumenes = data;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error("Error al recuperar resúmenes", err);
        this.cargando = false;
      }
    });
  }

  filtrarResumenes() {
    const texto = this.buscarResumen.toLowerCase().trim();
    const categoriasActivas = Object.keys(this.filtrosCategorias).filter(cat => this.filtrosCategorias[cat]);

    this.listaResumenes = this.listaResumenesOriginal.filter(resumen => {
      // Búsqueda en título O en descripción
      const coincideTexto = resumen.titulo.toLowerCase().includes(texto) || 
                           (resumen.descripcion && resumen.descripcion.toLowerCase().includes(texto));
      
      const categoriaResumen = resumen.categoria ? resumen.categoria.toLowerCase() : '';
      const coincideCategoria = categoriasActivas.length === 0 || categoriasActivas.includes(categoriaResumen);
      
      return coincideTexto && coincideCategoria;
    });
  }

  toggleCategoria(cat: string) {
    this.filtrosCategorias[cat] = !this.filtrosCategorias[cat];
    this.filtrarResumenes();
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

  solicitarEliminar(id: string, titulo: string) {
    this.resumenAEliminarId = id;
    this.resumenAEliminarTitulo = titulo;
    this.mostrarModalEliminar = true;
  }

  cancelarEliminar() {
    this.mostrarModalEliminar = false;
    this.resumenAEliminarId = null;
    this.resumenAEliminarTitulo = '';
  }

  confirmarEliminar() {
    if (!this.resumenAEliminarId || !this.usuarioActual) return;
    const id = this.resumenAEliminarId;

    if (this.usuarioActual) {
      this.resumenService.eliminarResumen(this.usuarioActual.uid, id).subscribe({
        next: () => {
          // Actualizamos la lista local
          this.listaResumenesOriginal = this.listaResumenesOriginal.filter((r: any) => r.id !== id);
          this.filtrarResumenes();
          
          // Feedback visual
          this.notif = { show: true, msg: '¡Resumen eliminado con éxito!', type: 'success' };
          setTimeout(() => this.notif.show = false, 2500);
          this.cancelarEliminar();
        },
        error: (err: any) => {
          this.notif = { show: true, msg: 'Error al eliminar el resumen.', type: 'danger' };
          console.error(err);
          this.cancelarEliminar();
        }
      });
    }
  }
}
