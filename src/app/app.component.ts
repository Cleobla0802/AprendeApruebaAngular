import { AfterViewInit, Component } from '@angular/core';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { PresentacionComponent } from './componentes/presentacion/presentacion.component';
import { LoginComponent } from './componentes/auth/login/login.component';
import { SiginComponent } from './componentes/auth/sigin/sigin.component';
import { filter, map } from 'rxjs';
import { ApuntesComponent } from './componentes/apuntes/apuntes.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,NavbarComponent, ApuntesComponent, FooterComponent, PresentacionComponent, LoginComponent, SiginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor() {}


}