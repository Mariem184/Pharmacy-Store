import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth } from '../../shared/interface/auth';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: BehaviorSubject<null | JwtPayload> = new BehaviorSubject<null | JwtPayload>(null);

  constructor(private _HttpClient: HttpClient) {}

  decodeUserdata() {
    const token = localStorage.getItem('userToken')!;
    const decode = jwtDecode(token);
    this.userData.next(decode);
    console.log(decode);
  }

  login(data: Auth): Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/auth/signin`, data);
  }

  register(data: Auth): Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/auth/signup`, data);
  }
}