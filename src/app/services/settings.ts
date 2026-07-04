import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; 

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private apiUrl = 'http://localhost:3000/settings';


  constructor(private http: HttpClient){}


private lowStockSubject = new BehaviorSubject<any[]>([]);
  lowStockProducts$ = this.lowStockSubject.asObservable();

  updateLowStockAlerts(products: any[]) {
    this.lowStockSubject.next(products);
  }


  getSettings(): Observable<any>{
    return this.http.get(this.apiUrl);
  }

  updateSettings(data: any): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.put(this.apiUrl, data, {headers});
  }

  getProducts(): Observable<any[]>{
    return this.http.get<any[]> ('https://raw.githubusercontent.com/Mariem184/pharmacy-api/refs/heads/main/products.json');
  }
}