import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  features = [
    { icon: 'fas fa-truck', title: 'Free delivery', desc: 'On orders over $35' },
    { icon: 'fas fa-shield-alt', title: 'Pharmacist verified', desc: 'Every product' },
    { icon: 'fa-regular fa-clock', title: 'Same-day dispatch', desc: 'Order by 2pm' },
    { icon: 'fa-solid fa-heart-pulse', title: 'Health advice', desc: 'Talk to our team' }
  ];
}
