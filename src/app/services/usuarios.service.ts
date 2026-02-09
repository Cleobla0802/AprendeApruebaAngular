import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Database, push, ref, set } from '@angular/fire/database';
import { Usuarios } from '../models/usuarios.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private db:Database, private auth:Auth) { }


  createUser(usuario: Usuarios) {
  const userRef = ref(this.db, `usuarios/${usuario.uid}`);
  return set(userRef, usuario);
}

}
