import { Injectable, signal } from '@angular/core';

export interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  orderId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  itemsCount: number;
  items: OrderItem[];
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  paymentMethod: string;
  shippingAddress: string;
  rating?: number;
  reviewComment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orders = signal<Order[]>([]);

  private mockOrders: Order[] = [
    {
      orderId: 'ORD-7841',
      customerName: 'Sarah Mitchell',
      customerEmail: 'sarah.m@email.com',
      date: '2026-06-18',
      itemsCount: 3,
      status: 'Delivered',
      total: 67.47,
      paymentMethod: 'card',
      shippingAddress: '12 El-Galaa St, Cairo',
      items: [
        { id: 1, name: 'Augmentin 1 g', price: 210, quantity: 1 },
        { id: 2, name: 'Xithrone 500 mg', price: 86, quantity: 2 }
      ]
    },
    {
      orderId: 'ORD-7840',
      customerName: 'James Thornton',
      customerEmail: 'j.thornton@email.com',
      date: '2026-06-18',
      itemsCount: 2,
      status: 'Shipped',
      total: 29.99,
      paymentMethod: 'cod',
      shippingAddress: '45 Pyramids Rd, Giza',
      items: [
        { id: 3, name: 'Ibuprofen 200mg Tablets', price: 8.99, quantity: 2 }
      ]
    },
    {
      orderId: 'ORD-7839',
      customerName: 'Priya Sharma',
      customerEmail: 'priya.s@email.com',
      date: '2026-06-17',
      itemsCount: 5,
      status: 'Processing',
      total: 112.35,
      paymentMethod: 'card',
      shippingAddress: '78 Ramsis St, Cairo',
      items: [
        { id: 10, name: 'Multivitamin Adults', price: 24.99, quantity: 3 },
        { id: 11, name: 'Lubricating Eye Drops', price: 7.99, quantity: 2 }
      ]
    },
    {
      orderId: 'ORD-7838',
      customerName: 'Carlos Ruiz',
      customerEmail: 'c.ruiz@email.com',
      date: '2026-06-17',
      itemsCount: 1,
      status: 'Pending',
      total: 18.99,
      paymentMethod: 'instapay',
      shippingAddress: '9 Abbas El-Akkad, Cairo',
      items: [
        { id: 7, name: 'Antiseptic Healing Cream', price: 14.50, quantity: 1 }
      ]
    },
    {
      orderId: 'ORD-7837',
      customerName: 'Emma Walsh',
      customerEmail: 'emma.w@email.com',
      date: '2026-06-16',
      itemsCount: 4,
      status: 'Delivered',
      total: 54.96,
      paymentMethod: 'card',
      shippingAddress: '15 El-Tahrir Sq, Cairo',
      items: [
        { id: 5, name: 'Vitamin C 1000mg', price: 12.00, quantity: 4 }
      ]
    },
    {
      orderId: 'ORD-7836',
      customerName: 'Mohammed Al-Rashid',
      customerEmail: 'm.alrashid@email.com',
      date: '2026-06-16',
      itemsCount: 6,
      status: 'Delivered',
      total: 88.47,
      paymentMethod: 'cod',
      shippingAddress: '30 El-Hagaz St, Heliopolis, Cairo',
      items: [
        { id: 6, name: 'Strepsils Honey & Lemon', price: 4.25, quantity: 6 }
      ]
    }
  ];

  constructor() {
    this.loadOrders();
  }

  private loadOrders() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pharmacy_orders');
      if (stored) {
        try {
          this.orders.set(JSON.parse(stored));
          return;
        } catch (e) {
          console.error('Error parsing stored orders, resetting to default', e);
        }
      }
      // Initialize with mock orders if empty
      this.orders.set(this.mockOrders);
      localStorage.setItem('pharmacy_orders', JSON.stringify(this.mockOrders));
    } else {
      this.orders.set(this.mockOrders);
    }
  }

  addOrder(order: Order) {
    const updated = [order, ...this.orders()];
    this.orders.set(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pharmacy_orders', JSON.stringify(updated));
    }
  }

  updateOrderStatus(orderId: string, status: Order['status']) {
    const updated = this.orders().map(o => o.orderId === orderId ? { ...o, status } : o);
    this.orders.set(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pharmacy_orders', JSON.stringify(updated));
    }
  }

  updateOrderReview(orderId: string, rating: number, comment: string) {
    const updated = this.orders().map(o => o.orderId === orderId ? { ...o, rating, reviewComment: comment } : o);
    this.orders.set(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pharmacy_orders', JSON.stringify(updated));
    }
  }
}
