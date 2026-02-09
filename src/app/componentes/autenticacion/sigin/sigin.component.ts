import { Component } from '@angular/core';
import { Auth, UserCredential } from '@angular/fire/auth';
import { Database, push, ref } from '@angular/fire/database';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sigin',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './sigin.component.html',
  styleUrl: './sigin.component.scss'
})
export class SiginComponent {

  registerForm: FormGroup;
  errores = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  register() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;

      this.authService.register(email, password)
        .then((userCredential: UserCredential) => {
          const uid = userCredential.user.uid;

          return this.authService.saveUsername(uid, username);
        })
        .then(() => {
          this.errores = false;
          this.router.navigate(['/componentes/apuntes']);
        })
        .catch(error => {
          console.error(error);
          this.errores = true;
        });

    } else {
      this.errores = true;
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .then(() => this.router.navigate(['/apuntes']))
      .catch(err => {
        console.error(err);
        this.errores = true;
      });
  }
}
