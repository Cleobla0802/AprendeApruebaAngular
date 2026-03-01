import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User, UserCredential } from '@angular/fire/auth';
import { Database, ref, set } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private db: Database, private auth: Auth, private router:Router) { }


  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      this.router.navigate(['/login']);
    })
    .catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
}

  loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  getUserAuthenticated(): Observable<User | null> {
    {
      return authState(this.auth);
    }
  }

  saveUsername(uid: string, username: string) {
    const userRef = ref(this.db, `usuarios/${uid}`);
    return set(userRef, { username });
  }

}
