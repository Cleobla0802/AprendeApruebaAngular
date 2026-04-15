import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PruebasService } from '../../../services/pruebas.service';

@Component({
  selector: 'app-realizar-tipo-test',
  imports: [CommonModule],
  templateUrl: './realizar-tipo-test.component.html',
  styleUrl: './realizar-tipo-test.component.scss'
})
export class RealizarTipoTestComponent {

  test: any = null;
  preguntaActual: number = 0;
  respuestasUsuario: number[] = [];
  mostrarResultado: boolean = false;
  puntuacion: number = 0;
  cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private testService: PruebasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.testService.obtenerTestPorId(id).subscribe(data => {
        this.test = data;
        this.cargando = false;
      });
    }
  }

  seleccionarRespuesta(indiceOpcion: number) {
    this.respuestasUsuario[this.preguntaActual] = indiceOpcion;
    
    // Pequeño retardo para pasar a la siguiente pregunta automáticamente
    setTimeout(() => {
      if (this.preguntaActual < this.test.preguntas.length - 1) {
        this.preguntaActual++;
      } else {
        this.finalizarTest();
      }
    }, 300);
  }

  finalizarTest() {
    let aciertos = 0;
    this.test.preguntas.forEach((pregunta: any, index: number) => {
      if (this.respuestasUsuario[index] === pregunta.respuestaCorrecta) {
        aciertos++;
      }
    });
    this.puntuacion = (aciertos / this.test.preguntas.length) * 10;
    this.mostrarResultado = true;
  }

  irAtras() {
    this.router.navigate(['/componentes/tests']);
  }

}
