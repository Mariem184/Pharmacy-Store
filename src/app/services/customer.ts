import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService{
  private apiUrl = 'https://ecommerce.routemisr.com/api/v1/users';
  constructor(private http: HttpClient){}
  getAllCustomers(): Observable<any>{
    return this.http.get(this.apiUrl);
  }
}