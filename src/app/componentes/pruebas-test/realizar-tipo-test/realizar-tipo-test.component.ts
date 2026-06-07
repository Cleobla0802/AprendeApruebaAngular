import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PruebasService } from '../../../services/pruebas.service';

@Component({
  selector: 'app-realizar-tipo-test',
  imports: [CommonModule],
  templateUrl: './realizar-tipo-test.component.html',
  styleUrl: './realizar-tipo-test.component.scss'
})
export class RealizarTipoTestComponent implements OnInit {

 test: any;
  preguntaActualIndex: number = 0;
  respuestasUsuario: number[] = [];
  testFinalizado: boolean = false;
  nota: number = 0;

  notif = { 
    show: false, 
    msg: '', 
    type: 'success' as 'success' | 'danger' | 'warning' | 'info' 
  };

  constructor(
    private route: ActivatedRoute,
    private testService: PruebasService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.testService.obtenerTestPorId(id).subscribe({
        next: (data) => {
          if (data) {
            // Unimos el ID de la URL con los datos de Firebase
            this.test = { id, ...data };
          } else {
            this.mostrarNotif('No se encontró el test en la base de datos.', 'warning');
          }
        },
        error: () => this.mostrarNotif('Error al cargar el test.', 'danger')
      });
    } else {
      this.mostrarNotif('ID de test no válido.', 'danger');
    }
  }

  get preguntaActual() {
    if (!this.test || !this.test.preguntas) return null;
    return this.test.preguntas[this.preguntaActualIndex];
  }

  seleccionarOpcion(index: number) {
    this.respuestasUsuario[this.preguntaActualIndex] = index;
    
    if (this.preguntaActualIndex < this.test.preguntas.length - 1) {
      setTimeout(() => this.preguntaActualIndex++, 300);
    } else {
      this.calcularResultado();
    }
  }

  terminarTest() {
    if (!this.test || this.testFinalizado) return;
    this.calcularResultado();
  }

  calcularResultado() {
    if (!this.test?.preguntas?.length) return;
    let aciertos = 0;
    this.test.preguntas.forEach((p: any, i: number) => {
      if (this.respuestasUsuario[i] === p.respuestaCorrecta) aciertos++;
    });

    this.nota = (aciertos / this.test.preguntas.length) * 10;

    // Guardamos la nota usando el ID que inyectamos en ngOnInit
    this.testService.guardarNota(this.test.id, this.nota).subscribe({
      next: () => {
        this.testFinalizado = true;
      },
      error: () => {
        this.mostrarNotif('Error al guardar la calificación.', 'warning');
        this.testFinalizado = true;
      }
    });
  }

  finalizar() {
    this.router.navigate(['/componentes/pruebas-test']);
  }

  private mostrarNotif(msg: string, type: 'success' | 'danger' | 'warning' | 'info') {
    this.notif = { show: true, msg, type };
    setTimeout(() => this.notif.show = false, 4000);
  }
}
