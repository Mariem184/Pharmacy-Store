import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang = signal<'en' | 'ar'>('en');

  constructor() {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('appLanguage') as 'en' | 'ar';
      if (savedLang === 'en' || savedLang === 'ar') {
        this.currentLang.set(savedLang);
        this.updateDirection(savedLang);
      } else {
        this.updateDirection('en');
      }
    }
  }

  setLanguage(lang: 'en' | 'ar') {
    this.currentLang.set(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLanguage', lang);
      this.updateDirection(lang);
    }
  }

  private updateDirection(lang: 'en' | 'ar') {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      html.setAttribute('lang', lang);
      html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      document.body.className = lang === 'ar' ? 'rtl-mode' : 'ltr-mode';
    }
  }

  translate(enText: string, arText: string): string {
    return this.currentLang() === 'ar' ? arText : enText;
  }
}
