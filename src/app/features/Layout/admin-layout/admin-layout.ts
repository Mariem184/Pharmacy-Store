import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Header } from '../../../shared/Components/header/header';
import { Sidebar } from '../../../shared/Components/sidebar/sidebar';
import { AuthService } from '../../../core/Services/auth';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet,Header,Sidebar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout implements OnInit {
  isSidebarOpen = false;

  constructor(private _AuthService: AuthService, private _Router: Router) {}

  ngOnInit() {
    if (!this._AuthService.userData.value || !this._AuthService.isAdmin()) {
      this._Router.navigate(['/home']);
    }
  }

  onToggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}

