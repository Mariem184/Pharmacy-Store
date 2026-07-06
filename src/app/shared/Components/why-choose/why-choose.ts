import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/Services/language.service';

@Component({
  selector: 'app-why-choose',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './why-choose.html',
  styleUrl: './why-choose.css',
})
export class WhyChoose {
  constructor(public langService: LanguageService) {}
}
