import { Component, OnInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../../core/Services/product.services';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, HttpClientModule],
  standalone: true,
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard implements OnInit, OnDestroy {
  
  @Input() currentCategory: string = 'all'; 

  products: any[] = [];        
  filteredProducts: any[] = [];
  totalProducts: number = 0;

  constructor(
    private http: HttpClient, 
    private productService: ProductService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.fetchProductsFromAPI(); 
    window.addEventListener('search-triggered', this.handleNavbarSearch);
  }

  ngOnDestroy(): void {
    window.removeEventListener('search-triggered', this.handleNavbarSearch);
  }

  handleNavbarSearch = () => {
    this.filterBySearch(this.productService.searchQuery);
  }

  fetchProductsFromAPI() {
    const cacheBuster = `https://raw.githubusercontent.com/Mariem184/pharmacy-api/refs/heads/main/products.json?t=${new Date().getTime()}`;

    this.http.get<any>(cacheBuster)
      .subscribe({
        next: (response) => {
          this.products = response.products;      
          this.totalProducts = this.products.length; 
          
          if (this.productService.searchQuery) {
            this.filterBySearch(this.productService.searchQuery);
          } else if (!this.currentCategory || this.currentCategory.toLowerCase().includes('all')) {
            this.filteredProducts = this.products; 
          } else {
            this.filterByCategory(this.currentCategory);
          }

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('حدث خطأ أثناء جلب البيانات الطبية:', err);
        }
      });
  }

  filterBySearch(query: string) {
    if (!query || query.trim() === '') {
      if (!this.currentCategory || this.currentCategory.toLowerCase().includes('all')) {
        this.filteredProducts = this.products;
      } else {
        this.filterByCategory(this.currentCategory);
      }
      this.cdr.detectChanges();
      return;
    }
    
    const cleanQuery = query.toLowerCase().trim();
    this.filteredProducts = this.products.filter(prod => 
      prod.name && prod.name.toLowerCase().includes(cleanQuery)
    );
    this.cdr.detectChanges();
  }

  filterByCategory(categoryName: string) {
    this.currentCategory = categoryName; 

    if (!this.products || this.products.length === 0) return;

    if (!categoryName || categoryName.trim() === '' || categoryName.toLowerCase().includes('all')) {
      this.filteredProducts = this.products;
      this.cdr.detectChanges();
      return;
    }

    const categoryMapping: { [key: string]: string } = {
      'anti-biotics': 'مضادات حيوية',
      'tablets & capsules': 'أقراص وكبسولات',
      'creams & ointment': 'كريمات ومراهم',
      'suppsitories': 'لبوس ومستحضرات شرجية',
      'eye care': 'قطرات ومستحضرات العين',
      'first aid': 'إسعافات أولية ومطهرات',
      'injections': 'حقن وأمبولات'
    };

    const selectedClean = categoryName.trim().toLowerCase();
    const arabicTranslation = categoryMapping[selectedClean] || selectedClean;

    this.filteredProducts = this.products.filter(prod => {
      const targetField = prod.badgeType || prod.category || '';
      const prodClean = targetField.trim().toLowerCase();
      
      return prodClean === selectedClean || 
             prodClean === arabicTranslation || 
             prodClean.includes(arabicTranslation) || 
             arabicTranslation.includes(prodClean);
    });

    this.cdr.detectChanges(); 
  }

  getDiscount(price: number, oldPrice?: number): number {
    if (!oldPrice) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }

  cartItems: any[] = []; 

  addToCart(product: any) {
    console.log('Added to cart:', product.name); 
    this.cartItems.push(product); 
  }
}