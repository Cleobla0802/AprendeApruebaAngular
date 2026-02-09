import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User, UserCredential } from '@angular/fire/auth';
import { Database, ref, set } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private db: Database, private auth: Auth) { }


  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    signOut(this.auth);
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
