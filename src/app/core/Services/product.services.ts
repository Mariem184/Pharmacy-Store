import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; 
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  searchQuery: string = ''; 
  // تعديل الرابط للمسار الصحيح تماماً لـ GitHub Raw
  apiUrl = 'https://raw.githubusercontent.com/Mariem184/pharmacy-api/refs/heads/main/products.json';  
  categoryChanged = new BehaviorSubject<string>('All Product'); 

  constructor(private http: HttpClient) {}

  // تأمين الدالة الأساسية لتخرج المصفوفة مباشرة للـ Component
  getProducts(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.products || [])
    );
  }

  searchProducts(keyword: string): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        const productsList = response.products || []; 
        
        if (!keyword.trim()) return productsList;
        
        return productsList.filter((product: any) => {
          // فحص كل الاحتمالات لاسم المنتج في الـ JSON لضمان عدم حدوث خطأ
          const productName = product.name || product.title || product.productName || '';
          return productName.toLowerCase().includes(keyword.toLowerCase());
        });
      })
    );
  }

  changeCategory(categoryName: string) {
    this.categoryChanged.next(categoryName); 
  }
}