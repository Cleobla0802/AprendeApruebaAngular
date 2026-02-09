import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserCredential } from 'firebase/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', Validators.required)
});


  constructor(private authService: AuthService, private router: Router) { }

  errores = false
  userLogin = {
    email: "",
    password: ""
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().then((user: UserCredential) => {
      this.router.navigate(['/componentes/apuntes']);
    }).catch((error: any) => {
      console.log(error);
    })
  }

  login() {
    if (this.userLogin.email && this.userLogin.password) {
      this.authService.login(this.userLogin.email, this.userLogin.password)
        .then((user: UserCredential) => {
          this.errores = false;
          this.router.navigate(['/componentes/apuntes']);
        })
        .catch((error) => {
          console.log(error);
          this.errores = true;
        });
    } else {
      this.errores = true;
    }
  }

}