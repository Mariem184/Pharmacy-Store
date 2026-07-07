import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private cloudUrl = 'https://api.restful-api.dev/objects/ff8081819d82fab6019f3a7854292678';

  constructor(private http: HttpClient){}

  getAllCustomers(): Observable<any>{
    return this.http.get<any>(this.cloudUrl).pipe(
      map(res => {
        let cloudUsers: any[] = [];
        if (res && res.data && Array.isArray(res.data.users)) {
          cloudUsers = res.data.users;
        }
        const merged = this.mergeLocalCustomers(cloudUsers);
        
        // Sync back to cloud in background if local had new ones not in cloud
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('local_registered_users');
          if (stored) {
            try {
              const localUsers = JSON.parse(stored);
              if (localUsers.length > cloudUsers.length) {
                this.syncToCloud(merged);
              }
            } catch(e){}
          }
        }
        return { users: merged };
      }),
      catchError(err => {
        const merged = this.mergeLocalCustomers([]);
        return of({ users: merged });
      })
    );
  }

  private syncToCloud(usersList: any[]) {
    this.http.put(this.cloudUrl, {
      name: 'Pharmacy_Users_Mariem_Store',
      data: { users: usersList }
    }).subscribe({
      next: () => console.log('Users synced to cloud successfully.'),
      error: (err) => console.error('Cloud users sync failed', err)
    });
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
    
    const newUser = {
      _id: 'reg-' + Math.random().toString(36).substr(2, 9),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      createdAt: new Date().toISOString()
    };

    const exists = users.some(u => u.email && u.email.toLowerCase() === user.email.toLowerCase());
    if (!exists) {
      users.push(newUser);
      localStorage.setItem('local_registered_users', JSON.stringify(users));
    }

    // Always fetch cloud data first, merge locally, and put back to prevent overwriting cloud state!
    this.http.get<any>(this.cloudUrl).subscribe({
      next: (res) => {
        let cloudUsers: any[] = [];
        if (res && res.data && Array.isArray(res.data.users)) {
          cloudUsers = res.data.users;
        }

        const merged = [...cloudUsers];
        
        // Add new user if not in cloud
        const existsInCloud = merged.some(cu => cu.email && cu.email.toLowerCase() === newUser.email.toLowerCase());
        if (!existsInCloud) {
          merged.push(newUser);
        }

        // Add any other local users
        users.forEach(lu => {
          const existsAlready = merged.some(cu => cu.email && cu.email.toLowerCase() === lu.email.toLowerCase());
          if (!existsAlready) {
            merged.push(lu);
          }
        });

        // Merge with orders and sync
        const finalMerged = this.mergeLocalCustomers(merged);
        this.syncToCloud(finalMerged);
      },
      error: (err) => {
        console.error('Failed to get cloud users for saving, syncing locally only', err);
        const finalMerged = this.mergeLocalCustomers(users);
        this.syncToCloud(finalMerged);
      }
    });
  }
}