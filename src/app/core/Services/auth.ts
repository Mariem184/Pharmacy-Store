import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth } from '../../shared/interface/auth';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: BehaviorSubject<null | JwtPayload> = new BehaviorSubject<null | JwtPayload>(null);

  constructor(private _HttpClient: HttpClient, @Inject(PLATFORM_ID) id:object, private _Router: Router) {
    if(isPlatformBrowser(id)){
      if(localStorage.getItem('userToken') != null)
      {
        this.decodeUserdata();
      }
    }
  }

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

  logout(){
    localStorage.removeItem('userToken');
    this.userData.next(null);
    this._Router.navigate(['/auth/login'])
  }
}