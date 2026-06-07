import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Database, onValue, ref } from '@angular/fire/database';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {

  usuarioActual: User | null = null;
  userNameDatabase: string | null = null;
  private unsubscribeAuth: (() => void) | null = null;
  private unsubscribeValue: (() => void) | null = null;

  constructor(
    private auth: Auth, 
    private db: Database, 
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.unsubscribeAuth = onAuthStateChanged(this.auth, (user) => {
      this.usuarioActual = user;

      if (this.unsubscribeValue) {
        this.unsubscribeValue();
        this.unsubscribeValue = null;
      }
      
      if (user) {
        const userRef = ref(this.db, `usuarios/${user.uid}/username`);
        this.unsubscribeValue = onValue(userRef, (snapshot) => {
          this.userNameDatabase = snapshot.val();
        });
      } else {
        this.userNameDatabase = null;
      }
    });
  }

  ngOnDestroy() {
    if (this.unsubscribeAuth) this.unsubscribeAuth();
    if (this.unsubscribeValue) this.unsubscribeValue();
  }

  logout() {
    this.authService.logout();
  }
}
