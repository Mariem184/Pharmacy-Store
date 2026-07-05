import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../../core/Services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true, 
  imports: [RouterModule, CommonModule], 
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar implements OnInit {
  @Input() isOpen = false;
  @Output() closeMenu = new EventEmitter<void>();

  onClose() {
    this.closeMenu.emit();
  }

  adminName: string = 'Admin';
  adminEmail: string = '';

  constructor(
    private router: Router,
    private _AuthService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this._AuthService.userData.subscribe({
      next: (user: any) => {
        if (user) {
          this.adminName = user.name || 'Admin';
          this.adminEmail = user.email || '';
        } else {
          this.adminName = 'Admin';
          this.adminEmail = '';
        }
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    this._AuthService.logout();
  }
}