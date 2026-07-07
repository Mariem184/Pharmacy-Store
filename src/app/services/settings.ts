import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs'; 

export interface StoreSettings {
  storeName: string;
  email: string;
  phone: string;
  deliveryThreshold: number;
  lowStockAlert: boolean;
  newOrderAlerts: boolean;
  returnRequests: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private defaultSettings: StoreSettings = {
    storeName: 'MediStore',
    email: 'admin@medistore.com',
    phone: '+20 2 2673 8000',
    deliveryThreshold: 500,
    lowStockAlert: true, 
    newOrderAlerts: true,
    returnRequests: false
  };

  private settingsSubject = new BehaviorSubject<StoreSettings>(this.defaultSettings);
  settings$ = this.settingsSubject.asObservable();

  private lowStockSubject = new BehaviorSubject<any[]>([]);
  lowStockProducts$ = this.lowStockSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadSettings();
  }

  private loadSettings() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('store_settings');
      if (stored) {
        try {
          this.settingsSubject.next(JSON.parse(stored));
        } catch (e) {
          console.error('Error parsing stored settings', e);
        }
      }
    }
  }

  getSettings(): Observable<StoreSettings> {
    return of(this.settingsSubject.value);
  }

  updateSettings(data: StoreSettings): Observable<StoreSettings> {
    this.settingsSubject.next(data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('store_settings', JSON.stringify(data));
    }
    return of(data);
  }

  getDeliveryThreshold(): number {
    return this.settingsSubject.value.deliveryThreshold ?? 500;
  }

  getStoreName(): string {
    return this.settingsSubject.value.storeName || 'MediStore';
  }

  getPhone(): string {
    return this.settingsSubject.value.phone || '+20 2 2673 8000';
  }

  getEmail(): string {
    return this.settingsSubject.value.email || 'admin@medistore.com';
  }

  getNewOrderAlerts(): boolean {
    return this.settingsSubject.value.newOrderAlerts ?? true;
  }

  getReturnRequests(): boolean {
    return this.settingsSubject.value.returnRequests ?? true;
  }

  getLowStockAlert(): boolean {
    return this.settingsSubject.value.lowStockAlert ?? true;
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]> ('https://raw.githubusercontent.com/Mariem184/pharmacy-api/refs/heads/main/products.json');
  }

  updateLowStockAlerts(products: any[]) {
    this.lowStockSubject.next(products);
  }
}