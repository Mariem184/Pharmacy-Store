import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; 
import { ProductService } from '../../../core/Services/product.services';
import { AuthService } from '../../../core/Services/auth';
import { CartService } from '../../../core/Services/cart.service';
import { SettingsService } from '../../../services/settings';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isLoggesIn: boolean = false;
  isAdmin: boolean = false;
  isMenuOpen: boolean = false;
  private isInitialized = false;

  searchQuery: string = '';

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  constructor(
    private productService: ProductService, 
    private _AuthService: AuthService,
    public cartService: CartService,
    public settingsService: SettingsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._AuthService.userData.subscribe({
      next:(res)=>{
        console.log(res);
        if(res != null){
          this.isLoggesIn = true;
          this.isAdmin = this._AuthService.isAdmin();
        }else{
          this.isLoggesIn = false;
          this.isAdmin = false;
        }
        if (this.isInitialized) {
          this.cdr.detectChanges();
        }
      }
    });
    this.isInitialized = true;
    this.cdr.detectChanges();
  }

  onSearch() {
    this.productService.searchQuery = this.searchQuery;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('search-triggered'));
    }
  }


  logout(){
    this._AuthService.logout();
  }

  toggleCart() {
    this.cartService.toggleDrawer();
  }
}