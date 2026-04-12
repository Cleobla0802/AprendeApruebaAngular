import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ApunteService } from '../../../services/apuntes.service';
import { ResumenesService } from '../../../services/resumenes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-resumen',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-resumen.component.html',
  styleUrl: './crear-resumen.component.scss'
})
export class CrearResumenComponent implements OnInit {
  cargando = false;
  generandoIA = false;
  uid: string = '';
  resumenResultado: string = '';
  mostrarCrearCategoria = false;
  nuevaCategoria = '';
  listaApuntes: any[] = [];
  seleccionados: any[] = [];

  categorias = [
    { valor: 'matematicas', nombre: 'Matemáticas' },
    { valor: 'ciencias', nombre: 'Ciencias' },
    { valor: 'ingles', nombre: 'Inglés' },
    { valor: 'historia', nombre: 'Historia' },
    { valor: 'tecnologia', nombre: 'Tecnología' }
  ];

  constructor(
  private apunteService: ApunteService,
    private authService: AuthService,
    private resumenesService: ResumenesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getUserAuthenticated().subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.cargarApuntes();
      }
    });
  }

  cargarApuntes() {
    this.cargando = true;
    this.apunteService.listarApuntesPorUsuario(this.uid).subscribe({
      next: (apuntes) => {
        this.listaApuntes = apuntes;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  toggleSeleccion(apunte: any) {
    const index = this.seleccionados.indexOf(apunte);
    if (index > -1) {
      this.seleccionados.splice(index, 1);
    } else {
      this.seleccionados.push(apunte);
    }
  }

  crearResumen() {
    // 1. Validaciones previas
    if (this.seleccionados.length === 0) {
      alert("Por favor, selecciona al menos un apunte.");
      return;
    }

    // 2. Cambiamos estados visuales
    this.generandoIA = true; 
    this.resumenResultado = ''; // Limpiamos resultado anterior

    // 3. Unimos el contenido de todos los apuntes seleccionados
    const textoUnificado = this.seleccionados
      .map(a => `TITULO: ${a.titulo}\nCONTENIDO: ${a.contenido}`)
      .join('\n\n---\n\n');

    console.log("Enviando a la IA...", textoUnificado);

    // 4. Llamada al servicio que conecta con Railway -> OpenRouter
    this.resumenesService.generarConIA(textoUnificado).subscribe({
      next: (res) => {
        this.resumenResultado = res.resumen;
        this.generandoIA = false;
        console.log("Resumen generado con éxito");
      },
      error: (err) => {
        console.error("Error al generar resumen:", err);
        alert("Hubo un error al conectar con la IA. Revisa la consola.");
        this.generandoIA = false;
      }
    });
  }

  toggleCrearCategoria() {
    this.mostrarCrearCategoria = !this.mostrarCrearCategoria;
    this.nuevaCategoria = '';
  }

  agregarCategoria() {
    const nombre = this.nuevaCategoria.trim();
    if (!nombre) return;

    const valor = nombre.toLowerCase().replace(/\s+/g, '');
    const existe = this.categorias.some(c => c.valor === valor);

    if (!existe) {
      this.categorias.push({ valor, nombre });
    }

    this.toggleCrearCategoria();
  }

  guardarResumenFinal() {
  if (!this.resumenResultado || !this.uid) return;

  const resumenParaGuardar = {
    titulo: `Resumen de ${this.seleccionados.length} apuntes`,
    contenido: this.resumenResultado,
    categoria: this.nuevaCategoria || 'general',
    userId: this.uid,
    fecha: new Date().toISOString()
  };

  this.cargando = true;
  this.resumenesService.guardarResumen(resumenParaGuardar).subscribe({
    next: () => {
      alert("¡Resumen guardado correctamente en tu biblioteca!");
      this.router.navigate(['/resumenes']); // Redirigir a la lista
    },
    error: (err) => {
      console.error("Error al guardar:", err);
      alert("No se pudo guardar el resumen.");
      this.cargando = false;
    }
  });
}
}
