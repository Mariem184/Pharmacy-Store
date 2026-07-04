import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-sidebar',
  standalone: true, 
  imports: [RouterModule, CommonModule], 
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar implements OnInit {

  adminName: string = 'Admin';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    console.log('Log out Success!');
    localStorage.removeItem('token'); 
    sessionStorage.clear(); 
    this.router.navigate(['/login']); 
  }
  
  
}