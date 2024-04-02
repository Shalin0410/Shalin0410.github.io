import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchBarService } from '../service/search-bar.service';
import { SearchResultsService } from '../service/search-result.service';
import { NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, NgbAlertModule, MatProgressSpinnerModule],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent {
  watchlist: any = [];
  isLoading: boolean = true;

  constructor(private searchBarService: SearchBarService, private router: Router, private searchResultsService: SearchResultsService) {}

  ngOnInit() {
    console.log('Watchlist Component Initialized');
    console.log('Route:', this.router.url);
    this.searchBarService.getWatchlist().subscribe((watchlist: any) => {
      console.log('Received watchlist');
      console.log('Watchlist:', watchlist);
      watchlist.forEach((stock: any) => {
        this.searchBarService.getCompanyQuote(stock.symbols).subscribe(companyQuote => {
          companyQuote = this.formatNumbersInObject(companyQuote);
          this.watchlist.push({ tickerSymbol: stock.symbols, companyName: stock.name, quote: companyQuote});
        });
      });
      this.isLoading = false;
      console.log('Watchlist:', this.watchlist);
    });
  }

  formatNumbersInObject(obj: any) {
    for (let key in obj) {
      if (typeof obj[key] === 'number') {
        obj[key] = parseFloat(obj[key].toFixed(2));
      }
    }
    return obj;
  }

  getColor(change: any) {
    if (change > 0) {
      return 'text-success fs-4';
    } else if (change < 0) {
      return 'text-danger fs-4';
    } else {
      return 'text-dark fs-4';
    }
  }

  getArrow(change: any) {
    if (change > 0) {
      return 'bi bi-caret-up-fill me-1';
    } else if (change < 0) {
      return 'bi bi-caret-down-fill me-1';
    } else {
      return '';
    }
  }

  removeStock(symbol: string) {
    console.log('Removing stock:', symbol);
    this.searchBarService.removeFromWatchlist(symbol);
    console.log('After Removing');
    console.log('Before:', this.watchlist);
    this.watchlist = this.watchlist.filter((stock: any) => stock.tickerSymbol !== symbol);
    console.log('After:', this.watchlist);
  }

  openDetails(symbol: string) {
    console.log('Opening details for:', symbol);
    let state = this.searchResultsService.getResults();
    console.log('State:', state);
    state.companyDetails.ticker = symbol;
    console.log('State:', state);
    state.callApiOnce = false;
    this.searchResultsService.setResults(state);
    // this.router.navigate(['/search', symbol]);
  }

}
