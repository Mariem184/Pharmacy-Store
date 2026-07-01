import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/Services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  constructor(private _AuthService: AuthService, private _Router: Router) {}

  regForm: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/),
      ]),
      rePassword: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/),
      ]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    },
    { validators: this.matchpass }
  );

  Register() {
    this.regForm.markAllAsTouched();
    if (this.regForm.valid) {
      this._AuthService.register(this.regForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.message == 'success') {
            this._Router.navigate(['/auth/login']);
          }
        },
        error: (err) => {
          console.log(err.error.message);
        },
      });
    }
    console.log(this.regForm.value);
  }

  matchpass(group: AbstractControl) {
    const pass = group.get('password')?.value;
    const rePass = group.get('rePassword')?.value;
    if (pass == rePass) {
      return null;
    } else {
      return { misMatch: true };
    }
  }
}