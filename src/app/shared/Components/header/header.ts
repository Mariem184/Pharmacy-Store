import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, signal } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../services/settings';
import { AuthService } from '../../../core/Services/auth';
import { OrderService } from '../../../core/Services/order.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  @Output() toggleSidebarMenu = new EventEmitter<void>();

  toggleSidebar() {
    this.toggleSidebarMenu.emit();
  }
  
  lowStockCount: number = 0;
  alertProducts: any[] = [];
  alertProductNames: string = '';
  showNotificationBox: boolean = false; 
  adminInitials: string = 'AM';
  dismissedNotificationIds = signal<string[]>([]);

  constructor(
    public settingsService: SettingsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dismissed_notifications');
      if (stored) {
        try {
          this.dismissedNotificationIds.set(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }

    this.authService.userData.subscribe((user: any) => {
      if (user && user.name) {
        this.adminInitials = this.getInitials(user.name);
      } else {
        this.adminInitials = 'AM';
      }
      this.cdr.detectChanges();
    });
    this.settingsService.lowStockProducts$.subscribe(products => {
      const isAlertEnabled = typeof localStorage !== 'undefined' && localStorage.getItem('lowStockAlert') !== 'false';

      if (isAlertEnabled) {
        this.alertProducts = products;
        this.lowStockCount = products.length;
        this.alertProductNames = products.map(p => p.name || 'Product').join(', ');
        
        if (products.length > 0) {
        }

      } else {
        this.alertProducts = [];
        this.lowStockCount = 0;
        this.alertProductNames = '';
      }

      this.cdr.detectChanges();
    });
  }

  toggleNotificationBox() {
    this.showNotificationBox = !this.showNotificationBox;
  }

  getInitials(name: string): string {
    if (!name) return 'AM';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  get orderNotifications() {
    const dismissed = this.dismissedNotificationIds();
    return this.orderService.orders().filter(o => 
      (o.status === 'Pending' || o.status === 'Cancelled') && 
      !dismissed.includes(o.orderId)
    );
  }

  get totalNotificationCount(): number {
    return this.lowStockCount + this.orderNotifications.length;
  }

  dismissNotification(orderId: string, event: Event) {
    event.stopPropagation();
    const updated = [...this.dismissedNotificationIds(), orderId];
    this.dismissedNotificationIds.set(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dismissed_notifications', JSON.stringify(updated));
    }
    this.cdr.detectChanges();
  }
}