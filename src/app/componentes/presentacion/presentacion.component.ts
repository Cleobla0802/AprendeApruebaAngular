import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-presentacion',
  imports: [CommonModule, RouterLink],
  templateUrl: './presentacion.component.html',
  styleUrl: './presentacion.component.scss'
})
export class PresentacionComponent {
  estaAutenticado = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getUserAuthenticated().subscribe(user => {
      this.estaAutenticado = !!user;
    });
  }

  navegarSegunEstado() {
    if (this.estaAutenticado) {
      this.router.navigate(['/componentes/apuntes']);
    } else {
      this.router.navigate(['/componentes/autenticacion/login']);
    }
  }
}
