import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { SearchBarService } from '../service/search-bar.service';
import { SearchResultsService } from '../service/search-result.service';
import { state } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-headernav-bar',
  standalone: true,
  imports: [RouterModule],
  providers: [SearchBarService, SearchResultsService],
  templateUrl: './headernav-bar.component.html',
  styleUrl: './headernav-bar.component.css'
})
export class HeadernavBarComponent {
  currentStateSymbol: string = '';
  constructor(private router: Router, private route: ActivatedRoute, private searchResultsService: SearchResultsService) {}




  ngOnInit() {
    console.log('Header Nav Bar Component Initialized');
    this.searchResultsService.stateValue.subscribe((state: any) => {
      console.log('Header Nav Bar Component State:', state);
      if (state) {
        console.log('We have a state');
        this.currentStateSymbol = state;
      } else {
        console.log('No state');
        this.currentStateSymbol = 'home';
      }
    });
  }

  navigateToSearch(){
    console.log('Navigating to search');
    this.router.navigate(['/search', this.currentStateSymbol]);
  }

  navigateToWatchlist(){
    console.log('Navigating to watchlist');
    this.router.navigate(['/watchlist']);
  }

  navigateToPortfolio(){
    console.log('Navigating to portfolio');
    this.router.navigate(['/portfolio']);
  }
  

  // stateCheck() {
  //   console.log('stateCheck');
  //   console.log(this.router.url);
  // }

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
