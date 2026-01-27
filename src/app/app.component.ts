import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { PresentacionComponent } from './componentes/presentacion/presentacion.component';
import { LoginComponent } from './componentes/autenticacion/login/login.component';
import { SiginComponent } from './componentes/autenticacion/sigin/sigin.component';
import { filter, map } from 'rxjs';
import { ApuntesComponent } from './componentes/apuntes/apuntes.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ApuntesComponent, FooterComponent, PresentacionComponent, LoginComponent, SiginComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showNavbar: boolean = true;
  showFooter: boolean = true;

  constructor(private router: Router) {}

}