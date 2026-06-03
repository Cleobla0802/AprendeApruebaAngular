import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Database, onValue, ref } from '@angular/fire/database';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  usuarioActual: User | null = null;
  userNameDatabase: string | null = null;

  constructor(
    private auth: Auth, 
    private db: Database, 
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      this.usuarioActual = user;
      
      if (user) {
        const userRef = ref(this.db, `usuarios/${user.uid}/username`);
        onValue(userRef, (snapshot) => {
          this.userNameDatabase = snapshot.val();
        });
      } else {
        this.userNameDatabase = null;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['componentes/presentacion']);
  }
}
