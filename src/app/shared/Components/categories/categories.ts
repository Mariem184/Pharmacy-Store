import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/Services/language.service';

@Component({
  selector: 'app-categories',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  constructor(public langService: LanguageService) {}

  get categoryList() {
    const isAr = this.langService.currentLang() === 'ar';
    return [
      { name: 'All Product', displayName: isAr ? 'الكل' : 'All Product', icon: 'fa-solid fa-bars' },
      { name: 'Anti-Biotics', displayName: isAr ? 'مضادات حيوية' : 'Anti-Biotics', icon: 'fa-solid fa-prescription-bottle-medical' },
      { name: 'Tablets & Capsules', displayName: isAr ? 'أقراص وكبسولات' : 'Tablets & Capsules', icon: 'fa-solid fa-capsules' },
      { name: 'Creams & Ointment', displayName: isAr ? 'كريمات ومراهم' : 'Creams & Ointment', icon: 'fa-solid fa-boxes-packing' },
      { name: 'Suppsitories', displayName: isAr ? 'لبوس ومستحضرات شرجية' : 'Suppsitories', icon: 'fa-solid fa-monument' },
      { name: 'Eye Care', displayName: isAr ? 'قطرات ومستحضرات العين' : 'Eye Care', icon: 'fas fa-eye' },
      { name: 'First Aid', displayName: isAr ? 'إسعافات أولية ومطهرات' : 'First Aid', icon: 'fa-solid fa-kit-medical' },
      { name: 'Injections', displayName: isAr ? 'حقن وأمبولات' : 'Injections', icon: 'fa-solid fa-syringe' }
    ];
  }
  activeItem: string = 'All Product'; 


  @Output() onCategorySelect = new EventEmitter<string>(); 

  setActive(itemName: string, event: Event) {
    event.preventDefault(); 
    this.activeItem = itemName; 
    
  
    this.onCategorySelect.emit(itemName); 
  }
}