import { Component, Inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  private authService = Inject(Auth);
  private router = Inject(Router);

  logout(){
    this.authService.
    this.router.navigate(["/componentes/presentacion"])
  }
}
