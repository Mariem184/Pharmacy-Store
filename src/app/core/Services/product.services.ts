import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  searchQuery: string = ''; 

  apiUrl = 'https://dummyjson.com/products';
  categoryChanged = new BehaviorSubject<string>('All Product'); 

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  searchProducts(keyword: string) {
    return this.http.get(`${this.apiUrl}/search?q=${keyword}`);
  }

  changeCategory(categoryName: string) {
    this.categoryChanged.next(categoryName); 
  }
}