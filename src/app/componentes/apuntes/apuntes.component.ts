import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ApunteService } from '../../services/apuntes.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-apuntes',
  imports: [RouterLink, RouterModule, CommonModule, FormsModule],
  templateUrl: './apuntes.component.html',
  styleUrl: './apuntes.component.scss'
})
export class ApuntesComponent {
  listaApuntes: any[] = []; 
  listaApuntesOriginal: any[] = []; 
  cargando = true;
  buscarApunte: string = '';

  // Estado de los botones de categorías
  filtrosCategorias: any = {
    matematicas: false,
    ciencias: false,
    ingles: false,
    historia: false,
    tecnologia: false
  };

  notif = { 
  show: false, 
  msg: '', 
  type: 'success' as 'success' | 'danger' | 'warning' | 'info' 
  };

  constructor(
    private apunteService: ApunteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUserAuthenticated().subscribe(user => {
      if (user) {
        this.obtenerApuntes(user.uid);
      } else {
        this.cargando = false;
        console.warn("No hay usuario autenticado");
      }
    });
  }

  obtenerApuntes(uid: string) {
    this.cargando = true;
    this.apunteService.listarApuntesPorUsuario(uid).subscribe({
      next: (data) => {
        this.listaApuntesOriginal = data;
        this.listaApuntes = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error("Error al recuperar apuntes", err);
        this.cargando = false;
      }
    });
  }

  // Se activa al escribir en el buscador o pulsar un checkbox
  filtrarApuntes() {
    const texto = this.buscarApunte.toLowerCase().trim();
    
    const categoriasActivas = Object.keys(this.filtrosCategorias).filter(cat => this.filtrosCategorias[cat]);

    this.listaApuntes = this.listaApuntesOriginal.filter(apunte => {
      // 1. Filtro por texto (Ahora busca en título Y en descripción)
      const titulo = apunte.titulo ? apunte.titulo.toLowerCase() : '';
      const descripcion = apunte.descripcion ? apunte.descripcion.toLowerCase() : '';
      
      const coincideTexto = titulo.includes(texto) || descripcion.includes(texto);
      
      // 2. Filtro por categoría
      const categoriaApunte = apunte.categoria ? apunte.categoria.toLowerCase() : '';
      const coincideCategoria = categoriasActivas.length === 0 || categoriasActivas.includes(categoriaApunte);

      return coincideTexto && coincideCategoria;
    });
  }

  // Método para los checkboxes
  toggleCategoria(cat: string) {
    this.filtrosCategorias[cat] = !this.filtrosCategorias[cat];
    this.filtrarApuntes();
  }

  eliminar(id: any) {
    // Llamamos al servicio para eliminar
    this.apunteService.eliminarApunte(id).subscribe({
      next: () => {
        // 1. Filtramos la lista local para que el elemento desaparezca al instante
        this.listaApuntesOriginal = this.listaApuntesOriginal.filter(a => a.id !== id);
        this.filtrarApuntes();

        // 2. Mostramos la notificación verde de éxito
        this.notif = { 
          show: true, 
          msg: '¡Borrado con éxito!', 
          type: 'success' 
        };

        // 3. La ocultamos automáticamente tras 2.5 segundos
        setTimeout(() => this.notif.show = false, 2500);
      },
      error: () => {
        // Si algo falla (ej. sin internet), avisamos en rojo
        this.notif = { 
          show: true, 
          msg: 'Error: No se pudo eliminar el elemento.', 
          type: 'danger' 
        };
      }
    });
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