import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CustomerService } from '../../../services/customer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerList implements OnInit {
  searchText: string = '';
  selectedFilter: string = 'All';
  
  // Use Angular Signal to trigger Zoneless change detection automatically on state update
  customers = signal<any[]>([]);

  constructor(
    private _customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._customerService.getAllCustomers().subscribe({
      next: (res) => {
        // Exclude admin accounts from the customer list
        const filtered = (res.users || []).filter((user: any) => {
          const email = user.email ? user.email.toLowerCase() : '';
          const role = user.role ? user.role.toLowerCase() : '';
          return !(role === 'admin' || email.includes('admin'));
        });
        
        // Setting the signal notifies Angular to schedule change detection automatically
        this.customers.set(filtered);
        console.log('Client Information', filtered[0]);
      },
      error: (err) => {
        console.log('Error', err);
      }
    });
  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  get filteredCustomers() {
    return this.customers().filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(this.searchText.toLowerCase());

      const now = new Date();
      const cDate = new Date(c.createdAt);
      let matchesFilter = false;

      if (this.selectedFilter === 'All') {
        matchesFilter = true;
      } else if (this.selectedFilter === 'Today') {
        matchesFilter = cDate.toDateString() === now.toDateString();
      } else if (this.selectedFilter === 'This Month') {
        matchesFilter = cDate.getMonth() === now.getMonth() &&
          cDate.getFullYear() === now.getFullYear();
      } else if (this.selectedFilter === 'This Year') {
        matchesFilter = cDate.getFullYear() === now.getFullYear();
      }
      return matchesSearch && matchesFilter;
    });
  }

  setFilter(filter: string) {
    console.log('doneeeeeeeeeee', filter);
    this.selectedFilter = filter;
    this.cdr.detectChanges();
  }

  deleteCustomer(id: string) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customers.set(this.customers().filter(c => c._id !== id));
      console.log('Deleted customer with ID:', id);
    }
  }
}
