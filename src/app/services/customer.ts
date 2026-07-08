import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private mockCustomers = [
    {
      _id: 'cust-1',
      name: 'Ahmed Mansour',
      email: 'ahmed.mansour@email.com',
      phone: '01023456789',
      createdAt: '2026-05-10T10:00:00.000Z'
    },
    {
      _id: 'cust-2',
      name: 'Mariam Ali',
      email: 'mariam.ali@email.com',
      phone: '01198765432',
      createdAt: '2026-05-15T11:30:00.000Z'
    },
    {
      _id: 'cust-3',
      name: 'Sarah Hassan',
      email: 'sarah.hassan@email.com',
      phone: '01234567890',
      createdAt: '2026-06-01T09:15:00.000Z'
    },
    {
      _id: 'cust-4',
      name: 'Omar Ibrahim',
      email: 'omar.ibrahim@email.com',
      phone: '01543210987',
      createdAt: '2026-06-12T14:45:00.000Z'
    },
    {
      _id: 'cust-5',
      name: 'Yasmine Gad',
      email: 'yasmine.gad@email.com',
      phone: '01065432109',
      createdAt: '2026-06-20T16:20:00.000Z'
    },
    {
      _id: 'cust-6',
      name: 'Khaled Youssef',
      email: 'khaled.youssef@email.com',
      phone: '01123456789',
      createdAt: '2026-07-01T12:00:00.000Z'
    }
  ];

  constructor(){}

  getAllCustomers(): Observable<any>{
    const merged = this.mergeLocalCustomers(this.mockCustomers);
    return of({ users: merged });
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
                _id: 'ord-' + email.toLowerCase().replace(/[^a-z0-9]/g, ''),
                name: name,
                email: email,
                phone: order.customerPhone || '',
                createdAt: order.date || new Date().toISOString()
              });
            } else if (existsInLocal) {
              const idx = localUsers.findIndex(u => u.email && u.email.toLowerCase() === email.toLowerCase());
              if (idx !== -1 && !localUsers[idx].phone && order.customerPhone) {
                localUsers[idx].phone = order.customerPhone;
              }
            }
          }
        });
      } catch (e) {
        console.error(e);
      }
    }

    const combined = [...apiUsers].map(cu => {
      const localMatch = localUsers.find(lu => lu.email && lu.email.toLowerCase() === cu.email.toLowerCase());
      if (localMatch) {
        return {
          ...cu,
          phone: localMatch.phone || cu.phone || ''
        };
      }
      return cu;
    });

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