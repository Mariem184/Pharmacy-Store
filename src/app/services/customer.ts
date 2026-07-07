import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'https://ecommerce.routemisr.com/api/v1/users';

  constructor(private http: HttpClient){}

  getAllCustomers(): Observable<any>{
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        const apiUsers = res.users || [];
        const merged = this.mergeLocalCustomers(apiUsers);
        return { users: merged };
      }),
      catchError(err => {
        const merged = this.mergeLocalCustomers([]);
        return of({ users: merged });
      })
    );
  }

  private mergeLocalCustomers(apiUsers: any[]): any[] {
    const localUsersStr = typeof localStorage !== 'undefined' ? localStorage.getItem('local_registered_users') : null;
    let localUsers: any[] = [];
    if (localUsersStr) {
      try {
        localUsers = JSON.parse(localUsersStr);
      } catch (e) {
        console.error(e);
      }
    }

    const ordersStr = typeof localStorage !== 'undefined' ? localStorage.getItem('pharmacy_orders') : null;
    if (ordersStr) {
      try {
        const orders = JSON.parse(ordersStr);
        orders.forEach((order: any) => {
          const email = order.customerEmail;
          const name = order.customerName;
          if (email && name) {
            const existsInApi = apiUsers.some(u => u.email && u.email.toLowerCase() === email.toLowerCase());
            const existsInLocal = localUsers.some(u => u.email && u.email.toLowerCase() === email.toLowerCase());
            if (!existsInApi && !existsInLocal) {
              localUsers.push({
                _id: 'local-' + Math.random().toString(36).substr(2, 9),
                name: name,
                email: email,
                createdAt: order.date || new Date().toISOString()
              });
            }
          }
        });
      } catch (e) {
        console.error(e);
      }
    }

    const combined = [...apiUsers];
    localUsers.forEach(lu => {
      const exists = combined.some(cu => cu.email && cu.email.toLowerCase() === lu.email.toLowerCase());
      if (!exists) {
        combined.push(lu);
      }
    });

    return combined;
  }

  saveLocalUser(user: { name: string; email: string; phone?: string }) {
    if (typeof localStorage === 'undefined') return;
    const stored = localStorage.getItem('local_registered_users');
    let users: any[] = [];
    if (stored) {
      try {
        users = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    const exists = users.some(u => u.email && u.email.toLowerCase() === user.email.toLowerCase());
    if (!exists) {
      users.push({
        _id: 'reg-' + Math.random().toString(36).substr(2, 9),
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('local_registered_users', JSON.stringify(users));
    }
  }
}