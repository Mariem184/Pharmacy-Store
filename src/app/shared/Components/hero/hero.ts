import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/Services/language.service';

@Component({
  selector: 'app-hero',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  constructor(public langService: LanguageService) {}

  get features() {
    const isAr = this.langService.currentLang() === 'ar';
    return [
      { icon: 'fas fa-truck', title: isAr ? 'توصيل مجاني' : 'Free delivery', desc: isAr ? 'للطلبات فوق 35 جنيه' : 'On orders over $35' },
      { icon: 'fas fa-shield-alt', title: isAr ? 'موثوق ومعتمد' : 'Pharmacist verified', desc: isAr ? 'من الصيادلة لكل منتج' : 'Every product' },
      { icon: 'fa-regular fa-clock', title: isAr ? 'شحن في نفس اليوم' : 'Same-day dispatch', desc: isAr ? 'للطلبات قبل 2 مساءً' : 'Order by 2pm' },
      { icon: 'fa-solid fa-heart-pulse', title: isAr ? 'نصائح طبية' : 'Health advice', desc: isAr ? 'تحدث مع فريقنا الطبي' : 'Talk to our team' }
    ];
  }

  scrollToProducts() {
    if (typeof document !== 'undefined') {
      const element = document.getElementById('products-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}
