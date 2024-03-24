import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { SearchBarService } from '../service/search-bar.service';

@Component({
  selector: 'app-headernav-bar',
  standalone: true,
  imports: [RouterModule],
  providers: [SearchBarService],
  templateUrl: './headernav-bar.component.html',
  styleUrl: './headernav-bar.component.css'
})
export class HeadernavBarComponent {
  constructor(private router: Router, private searchBarService: SearchBarService) {}

  ngOnInit() {
    console.log('Header Nav Bar Component Initialized');
  }

  searchWithSymbol() {
    if (this.searchBarService.currentSearchQuery) {
      const searchQuery = (document.getElementById('searchQuery') as HTMLInputElement).value;
      this.router.navigate(['/search', searchQuery]);
    } else {
      this.router.navigate(['/search/home']);
    }
    //this.router.navigate(['/search', searchQuery]);
  }

  isActive(): boolean {
    const url = this.router.url;
    return this.router.url.startsWith('/search/home');
  }
}
