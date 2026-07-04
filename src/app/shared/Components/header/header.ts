import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../services/settings';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  
  lowStockCount: number = 0;
  alertProducts: any[] = [];
  alertProductNames: string = '';
  showNotificationBox: boolean = false; 

  constructor(
    private settingsService: SettingsService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.settingsService.lowStockProducts$.subscribe(products => {
      const isAlertEnabled = localStorage.getItem('lowStockAlert') !== 'false';

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
}