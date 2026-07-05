import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Navbar } from '../../../shared/Components/navbar/navbar';
import { Footer } from '../../../shared/Components/footer/footer';
import { Cart } from '../../../shared/Components/cart/cart';

interface StoreBranch {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  status: string; // 'Open' or 'Closed'
  mapEmbedUrl: string;
  directionsUrl: string;
}

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, Navbar, Footer, Cart],
  templateUrl: './location.html',
  styleUrls: ['./location.css']
})
export class LocationComponent implements OnInit {
  stores: StoreBranch[] = [
    {
      id: 'branch-1',
      name: 'Main Store - New Cairo',
      address: 'Cairo Festival City, Ring Road, New Cairo, Cairo, Egypt',
      phone: '+20 2 2673 8000',
      hours: '8:00 AM - 11:00 PM',
      status: 'Open Now',
      mapEmbedUrl: 'https://maps.google.com/maps?q=Cairo%20Festival%20City&t=&z=13&ie=UTF8&iwloc=&output=embed',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Cairo+Festival+City'
    },
    {
      id: 'branch-2',
      name: 'Dokki Branch - Giza',
      address: 'El Tahrir St, Dokki, Giza Governorate, Egypt',
      phone: '+20 2 3335 1204',
      hours: '24 Hours',
      status: 'Open 24/7',
      mapEmbedUrl: 'https://maps.google.com/maps?q=Dokki%20Giza&t=&z=13&ie=UTF8&iwloc=&output=embed',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Dokki+Giza'
    },
    {
      id: 'branch-3',
      name: 'Alexandria Branch - Corniche',
      address: 'El-Gaish Road, Stanley, Alexandria, Egypt',
      phone: '+20 3 546 8920',
      hours: '9:00 AM - 10:00 PM',
      status: 'Open Now',
      mapEmbedUrl: 'https://maps.google.com/maps?q=Stanley%20Alexandria&t=&z=13&ie=UTF8&iwloc=&output=embed',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Stanley+Alexandria'
    }
  ];

  selectedStore!: StoreBranch;
  sanitizedMapUrl!: SafeResourceUrl;
  searchQuery = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Select main branch by default
    this.selectStore(this.stores[0]);
  }

  selectStore(store: StoreBranch) {
    this.selectedStore = store;
    this.sanitizedMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(store.mapEmbedUrl);
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
  }

  get filteredStores() {
    if (!this.searchQuery) return this.stores;
    return this.stores.filter(store => 
      store.name.toLowerCase().includes(this.searchQuery) || 
      store.address.toLowerCase().includes(this.searchQuery)
    );
  }
}
