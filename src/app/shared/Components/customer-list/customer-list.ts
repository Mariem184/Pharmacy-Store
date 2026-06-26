import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerList {
   searchText: string = '';
   selectedFilter: string = 'All';

  customers = [
    {name: 'Sarah Mitchell',date: '2024-03-15', email: 'sarah.m@email.com', phone: '+44 7700 900142', orders: 14, spent: 487, status: 'Inactive'},
    {name: 'James Thornton',date: '2024-07-22', email: 'j.thornton@email.com', phone: '+44 7700 900287', orders: 6, spent: 199, status: 'Active'},
    {name: 'Priya Sharma', email: 'priya.s@email.com', phone: '+44 7700 900391', orders: 22, spent: 1125, status: 'Active'},

  ];

  getInitials(name: string): string{
    const parts = name.split(' ');
    if(parts.length >= 2){
      return(parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0,2).toUpperCase();
  }

  get filteredCustomers(){
    return this.customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesFilter = (this.selectedFilter === 'All')? true : (c.status === this.selectedFilter);
      return matchesSearch && matchesFilter;
    });
  }

  setFilter(filter: string){
    this.selectedFilter = filter;
  }
}
