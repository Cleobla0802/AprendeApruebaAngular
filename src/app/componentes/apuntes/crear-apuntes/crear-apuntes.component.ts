import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-apuntes',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-apuntes.component.html',
  styleUrl: './crear-apuntes.component.scss'
})
export class CrearApuntesComponent {
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

  crearApuntes() {
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
