import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PruebasService } from '../../services/pruebas.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pruebas-test',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './pruebas-test.component.html',
  styleUrl: './pruebas-test.component.scss'
})
export class PruebasTestComponent implements OnInit {
 listaTests: any[] = [];
  listaTestsOriginal: any[] = [];
  cargando = true;
  buscarTest: string = '';

  // Filtros de categorías
  filtrosCategorias: any = {
    matematicas: false,
    ciencias: false,
    ingles: false,
    historia: false,
    tecnologia: false
  };

  // Notificación
  notif = { 
    show: false, 
    msg: '', 
    type: 'success' as 'success' | 'danger' | 'warning' | 'info' 
  };
  mostrarModalEliminar = false;
  testAEliminarId: string | null = null;
  testAEliminarTitulo = '';

  constructor(
    private testService: PruebasService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUserAuthenticated().subscribe(user => {
      if (user) {
        this.obtenerTests(user.uid);
      } else {
        this.cargando = false;
      }
    });
  }

  obtenerTests(uid: string) {
    this.cargando = true;
    this.testService.listarTestsPorUsuario(uid).subscribe({
      next: (data) => {
        this.listaTestsOriginal = data;
        this.listaTests = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  filtrarTests() {
    const texto = this.buscarTest.toLowerCase().trim();
    const categoriasActivas = Object.keys(this.filtrosCategorias).filter(cat => this.filtrosCategorias[cat]);

    this.listaTests = this.listaTestsOriginal.filter(test => {
      const coincideTexto = test.titulo.toLowerCase().includes(texto);
      const categoriaTest = test.categoria ? this.normalizarCategoria(test.categoria) : '';
      const coincideCategoria = categoriasActivas.length === 0 || categoriasActivas.includes(categoriaTest);

      return coincideTexto && coincideCategoria;
    });
  }

  normalizarCategoria(categoria: string): string {
  return categoria.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  }

  toggleCategoria(cat: string) {
    this.filtrosCategorias[cat] = !this.filtrosCategorias[cat];
    this.filtrarTests();
  }

  solicitarEliminar(id: string, titulo: string) {
    this.testAEliminarId = id;
    this.testAEliminarTitulo = titulo;
    this.mostrarModalEliminar = true;
  }

  cancelarEliminar() {
    this.mostrarModalEliminar = false;
    this.testAEliminarId = null;
    this.testAEliminarTitulo = '';
  }

  confirmarEliminar() {
    if (!this.testAEliminarId) return;
    const id = this.testAEliminarId;

    this.testService.eliminarTest(id).subscribe({
      next: () => {
        // 1. Filtrar localmente para que desaparezca de la vista al momento
        this.listaTestsOriginal = this.listaTestsOriginal.filter(t => t.id !== id);
        this.filtrarTests();

        // 2. Notificación de éxito (2.5s como en Apuntes)
        this.notif = { 
          show: true, 
          msg: '¡Prueba borrada con éxito!', 
          type: 'success' 
        };
        setTimeout(() => this.notif.show = false, 2500);
        this.cancelarEliminar();
      },
      error: () => {
        // Notificación de error en rojo
        this.notif = { 
          show: true, 
          msg: 'Error: No se pudo eliminar la prueba.', 
          type: 'danger' 
        };
        setTimeout(() => this.notif.show = false, 2500);
        this.cancelarEliminar();
      }
    });
  }

  estaGenerando(test: any): boolean {
    return test?.estado === 'generando';
  }

  tieneErrorGeneracion(test: any): boolean {
    return test?.estado === 'error' || (!test?.estado && (!test?.preguntas || test.preguntas.length === 0));
  }

  tienePreguntas(test: any): boolean {
    return Array.isArray(test?.preguntas) && test.preguntas.length > 0;
  }

  getBgColor(categoria: string): string {
    if (!categoria) return 'secondary';
    const normalizada = this.normalizarCategoria(categoria);
    const colores: any = {
      'matematicas': 'primary',
      'ciencias': 'success',
      'ingles': 'info',
      'historia': 'warning',
      'tecnologia': 'danger'
    };
    return colores[normalizada] || 'secondary';
  }
}
