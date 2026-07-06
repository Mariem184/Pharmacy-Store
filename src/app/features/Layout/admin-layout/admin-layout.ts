import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from '../../../shared/Components/header/header';
import { Sidebar } from '../../../shared/Components/sidebar/sidebar';
import { AuthService } from '../../../core/Services/auth';
import { NotificationService } from '../../../core/Services/notification.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Sidebar, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout implements OnInit {
  isSidebarOpen = false;

  constructor(
    private _AuthService: AuthService, 
    private _Router: Router,
    public notificationService: NotificationService
  ) {}

  ngOnInit() {
    if (!this._AuthService.userData.value || !this._AuthService.isAdmin()) {
      this._Router.navigate(['/home']);
    }
  }

  onToggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}

