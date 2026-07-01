import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/Services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private _AuthService: AuthService, private _Router: Router) {}

  logForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/),
    ]),
  });

  Login() {
  this.logForm.markAllAsTouched();

  if (this.logForm.valid) {
    this._AuthService.login(this.logForm.value).subscribe({
      next: (res) => {
        console.log(res);

        if (res.message == 'success') {
          localStorage.setItem('userToken', res.token);
          this._AuthService.decodeUserdata();
          this._Router.navigate(['/']);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
}