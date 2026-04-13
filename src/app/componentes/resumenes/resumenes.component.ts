import { Component } from '@angular/core';
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
export class ResumenesComponent {
listaResumenes: any[] = []; 
  listaResumenesOriginal: any[] = []; 
  cargando = true;
  buscarResumen: string = '';
  usuarioActual: any = null;

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
    this.resumenService.getResumenesByUser(uid).subscribe({
      next: (data) => {
        this.listaResumenesOriginal = data;
        this.listaResumenes = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error("Error al recuperar resúmenes", err);
        this.cargando = false;
      }
    });
  }

  filtrarResumenes() {
    const texto = this.buscarResumen.toLowerCase().trim();
    const categoriasActivas = Object.keys(this.filtrosCategorias).filter(cat => this.filtrosCategorias[cat]);

    this.listaResumenes = this.listaResumenesOriginal.filter(resumen => {
      const coincideTexto = resumen.titulo.toLowerCase().includes(texto);
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

  eliminar(id: any) {
    // Usamos this.usuarioActual que guardamos en el ngOnInit
    if (this.usuarioActual && confirm('¿Estás seguro de que quieres borrar este resumen?')) {
      this.resumenService.eliminarResumen(this.usuarioActual.uid, id).subscribe({
        next: () => {
          this.listaResumenesOriginal = this.listaResumenesOriginal.filter((r: any) => r.id !== id);
          this.filtrarResumenes();
        },
        error: (err: any) => console.error("Error al eliminar", err)
      });
    }
  }

}
