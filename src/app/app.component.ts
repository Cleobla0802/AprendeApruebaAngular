import { AfterViewInit, Component } from '@angular/core';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { HomeComponent } from './componentes/home/home.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { PresentacionComponent } from './componentes/presentacion/presentacion.component';
import { LoginComponent } from './componentes/auth/login/login.component';
import { SiginComponent } from './componentes/auth/sigin/sigin.component';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,NavbarComponent, HomeComponent, FooterComponent, PresentacionComponent, LoginComponent, SiginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
showNavbar = true;
  showFooter = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route.snapshot.data;
      })
    ).subscribe(data => {
      this.showNavbar = data['showNavbar'] ?? true;
      this.showFooter = data['showFooter'] ?? true;
    });
  }
}