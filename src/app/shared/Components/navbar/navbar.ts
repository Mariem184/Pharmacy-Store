import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; 
import { ProductService } from '../../../core/Services/product.services';
import { AuthService } from '../../../core/Services/auth';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
isLoggesIn: boolean = false;

 searchQuery: string = '';

  constructor(private productService: ProductService, private _AuthService: AuthService) {
    this._AuthService.userData.subscribe({
      next:(res)=>{
        console.log(res);
        if(res != null){
          this.isLoggesIn = true;
        }else{
          this.isLoggesIn = false;
        }
      }
    })
  }

  onSearch() {
    this.productService.searchQuery = this.searchQuery;
    window.dispatchEvent(new CustomEvent('search-triggered'));
  }


  logout(){
    this._AuthService.logout();
  }
}