import { Component, Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  usuarioActual: User | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.getUserAuthenticated().subscribe(user => {
      this.usuarioActual = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['componentes/presentacion']);
  }
}
