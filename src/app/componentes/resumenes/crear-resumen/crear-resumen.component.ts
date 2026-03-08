import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-resumen',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-resumen.component.html',
  styleUrl: './crear-resumen.component.scss'
})
export class CrearResumenComponent {
   cargando = false;

  mostrarCrearCategoria = false;
  nuevaCategoria = '';

  categorias = [
    { valor: 'matematicas', nombre: 'Matemáticas' },
    { valor: 'ciencias', nombre: 'Ciencias' },
    { valor: 'ingles', nombre: 'Inglés' },
    { valor: 'historia', nombre: 'Historia' },
    { valor: 'tecnologia', nombre: 'Tecnología' }
  ];

  crearResumen() {
    this.cargando = true;
    setTimeout(() => {
      this.cargando = false;
    }, 2000);
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
}
