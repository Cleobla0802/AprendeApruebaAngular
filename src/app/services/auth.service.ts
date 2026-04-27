import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User, UserCredential } from '@angular/fire/auth';
import { Database, ref, set } from '@angular/fire/database';
import { Router } from '@angular/router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Observable } from 'rxjs';
import { ApunteService } from './apuntes.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private db: Database, private auth: Auth, private router: Router) { }

  checkEmailExists(email: string): Promise<boolean> {
    return fetchSignInMethodsForEmail(this.auth, email).then(methods => methods.length > 0);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  getUserAuthenticated(): Observable<User | null> {
    return authState(this.auth);
  }

  saveUsername(uid: string, username: string) {
    const userRef = ref(this.db, `usuarios/${uid}`);
    return set(userRef, { username });
  }

  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

}
