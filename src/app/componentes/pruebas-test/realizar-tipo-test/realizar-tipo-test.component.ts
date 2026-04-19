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
  respuestasUsuario: number[] = []; // Guardamos el índice de la opción elegida
  testFinalizado: boolean = false;
  nota: number = 0;

  constructor(
    private route: ActivatedRoute,
    private testService: PruebasService,
    private router: Router
  ) {}

ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
  console.log("ID recuperado de la URL:", id); // <-- LOG 1

  if (id) {
    this.testService.obtenerTestPorId(id).subscribe(data => {
      console.log("Datos recibidos de Firebase:", data); // <-- LOG 2
      this.test = data;
    });
  } else {
    console.error("No se encontró ID en la ruta");
  }
}

  get preguntaActual() {
    return this.test?.preguntas[this.preguntaActualIndex];
  }

  seleccionarOpcion(index: number) {
    this.respuestasUsuario[this.preguntaActualIndex] = index;
    
    // Avanzar automáticamente o esperar a que el usuario de a "Siguiente"
    if (this.preguntaActualIndex < this.test.preguntas.length - 1) {
      setTimeout(() => this.preguntaActualIndex++, 300);
    } else {
      this.calcularResultado();
    }
  }

  calcularResultado() {
    let aciertos = 0;
    this.test.preguntas.forEach((p: any, i: number) => {
      if (this.respuestasUsuario[i] === p.respuestaCorrecta) {
        aciertos++;
      }
    });
    this.nota = (aciertos / this.test.preguntas.length) * 10;
    this.testService.guardarNota(this.test.id, this.nota).subscribe(() => {
      console.log("Nota guardada con éxito");
    });
    this.testFinalizado = true;
  }

  finalizar() {
    this.router.navigate(['componentes/pruebas-test']);
  }

}
