import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../services/settings';
import { AuthService } from '../../../core/Services/auth';

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

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
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
}