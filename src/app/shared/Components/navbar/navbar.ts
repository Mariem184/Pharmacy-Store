import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; 
import { ProductService } from '../../../core/Services/product.services';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
 searchQuery: string = '';

  constructor(private productService: ProductService) {}

  onSearch() {
    this.productService.searchQuery = this.searchQuery;
    window.dispatchEvent(new CustomEvent('search-triggered'));
  }
}