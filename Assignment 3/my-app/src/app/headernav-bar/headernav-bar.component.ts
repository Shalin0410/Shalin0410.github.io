import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { SearchBarService } from '../service/search-bar.service';
import { SearchResultsService } from '../service/search-result.service';

@Component({
  selector: 'app-headernav-bar',
  standalone: true,
  imports: [RouterModule],
  providers: [SearchBarService, SearchResultsService],
  templateUrl: './headernav-bar.component.html',
  styleUrl: './headernav-bar.component.css'
})
export class HeadernavBarComponent {
  constructor(private router: Router, public searchResultsService: SearchResultsService) {}

  ngOnInit() {
    console.log('Header Nav Bar Component Initialized');
  }

  stateCheck() {
    console.log('stateCheck');
    console.log(this.router.url);

  }

  // searchWithSymbol() {
  //   console.log('searchWithSymbol');
  //   const searchQuery = this.searchBarService.getCurrentSearchQuery();
  //   console.log('headerNav searchQuery: ' + searchQuery);
  //   this.router.navigate(['/search', searchQuery]);
    
  // }




  // searchWithSymbol() {
  //   if (this.searchBarService.currentSearchQuery) {
  //     const searchQuery = (document.getElementById('searchQuery') as HTMLInputElement).value;
  //     console.log('headerNav searchQuery: ' + searchQuery);
  //     this.router.navigate(['/search', searchQuery]);
  //   } else {
  //     this.router.navigate(['/search/home']);
  //   }
  //   //this.router.navigate(['/search', searchQuery]);
  // }

  isActive(): boolean {
    const url = this.router.url;
    return this.router.url.startsWith('/search');
  }
}
