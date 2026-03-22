import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ApunteService } from '../../services/apuntes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apuntes',
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './apuntes.component.html',
  styleUrl: './apuntes.component.scss'
})
export class ApuntesComponent {
  listaApuntes: any[] = [];
  cargando = true;

  constructor(private apunteService: ApunteService) {}

  ngOnInit(): void {
    this.obtenerApuntes();
  }

  obtenerApuntes() {
    this.cargando = true;
    this.apunteService.listarApuntes().subscribe({
      next: (data) => {
        this.listaApuntes = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error("Error al recuperar apuntes", err);
        this.cargando = false;
      }
    });
  }

  getBgColor(categoria: string): string {
    const colores: any = {
      'matematicas': 'primary',
      'ciencias': 'success',
      'ingles': 'info',
      'historia': 'warning',
      'tecnologia': 'danger'
    };
    return colores[categoria?.toLowerCase()] || 'secondary';
  }
}
