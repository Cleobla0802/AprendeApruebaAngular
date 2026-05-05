import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User, UserCredential } from '@angular/fire/auth';
import { Database, get, ref, set, update } from '@angular/fire/database';
import { Router } from '@angular/router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Observable } from 'rxjs';
import { ApunteService } from './apuntes.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private db: Database, private auth: Auth, private router: Router) { }

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

  loginWithGoogle(): Promise<any> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider).then((result) => {
      const uid = result.user.uid;
      const email = result.user.email || '';
      const username = result.user.displayName || '';
      return this.guardarEmailUsuario(uid, email)
        .then(() => this.saveUsername(uid, username));
    });
  }

  getUserAuthenticated(): Observable<User | null> {
    return authState(this.auth);
  }

  saveUsername(uid: string, username: string) {
    const userRef = ref(this.db, `usuarios/${uid}`);
    return update(userRef, { username });
  }

  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  guardarEmailUsuario(uid: string, email: string): Promise<void> {
    return set(ref(this.db, `usuarios/${uid}/email`), email);
  }

  checkEmailEnDatabase(email: string): Promise<boolean> {
    return get(ref(this.db, 'usuarios')).then(snapshot => {
      if (!snapshot.exists()) return false;
      const usuarios = snapshot.val();
      return Object.values(usuarios).some((u: any) => u && u.email && u.email.toLowerCase() === email.toLowerCase());
    });
  }

}
