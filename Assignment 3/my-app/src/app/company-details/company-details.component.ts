import { Component, Input, inject, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchAndErrorComponent } from '../search-and-error/search-and-error.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SearchBarService } from '../service/search-bar.service';
import { SummaryComponent } from '../summary/summary.component';
import { TopNewsComponent } from '../top-news/top-news.component';
import { ChartsComponent } from '../charts/charts.component';
import { InsightsComponent } from '../insights/insights.component';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [
    NgbAlertModule, 
    CommonModule,  
    MatTabsModule, 
    SummaryComponent, 
    TopNewsComponent, 
    ChartsComponent, 
    InsightsComponent,
    FormsModule],
  providers: [SearchBarService],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.css'
})
export class CompanyDetailsComponent {
  @Input() searchResults: any;
  market: string = '';
  intervalId: any;
  marketColor: string = '';
  isInWatchlist: boolean = false;
  private subscription: Subscription = new Subscription();
  private modalService = inject(NgbModal);
	closeResult = '';
  quantity: number = 0;
  purchaseMessage: string = '';

  constructor(private searchBarService: SearchBarService) {}

  ngOnInit() {
    console.log('Company Details Component Initialized');
    console.log('searchResults:', this.searchResults.companyDetails.ticker);
    this.searchBarService.getCompanyQuote(this.searchResults.companyDetails.ticker).subscribe(companyQuote => {
      console.log('Received companyQuote');
      this.searchResults.companyQuote = this.formatNumbersInObject(companyQuote);
      this.checkMarketStatus();
    });
    if (this.searchResults.watchlist) {
      this.searchResults.watchlist.forEach((ticker: any) => {
        if (ticker === this.searchResults.companyDetails.ticker) {
          this.isInWatchlist = true;
        }
      });
    }
    this.subscription = interval(1500000).subscribe(() => {
      console.log('Checking market status');
      console.log('searchQuery:', this.searchResults);
      this.searchBarService.getCompanyQuote(this.searchResults).subscribe(companyQuote => {
        console.log('Received companyQuote');
        this.searchResults.companyQuote = this.formatNumbersInObject(companyQuote);
        this.checkMarketStatus();
      });
    });
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  formatNumbersInObject(obj: any) {
    for (let key in obj) {
      if (typeof obj[key] === 'number') {
        obj[key] = parseFloat(obj[key].toFixed(2));
      }
    }
    return obj;
  }

  checkMarketStatus() {
    const currentTimestamp = Date.now();
    if (this.searchResults && this.searchResults.companyQuote.t) {
      const difference = currentTimestamp - this.searchResults.companyQuote.t * 1000;
      if (difference > 300000) {
        this.market = 'Market is closed ' + this.convertDate(this.searchResults.companyQuote.t);
      } else {
        this.market = 'Market is open';
      }
      this.getMarketColor();
    }
  }

  getMarketColor() {
    if (this.market.startsWith('Market is closed')) {
      console.log('Market is closed');
      this.marketColor = 'text-danger';
    } else {
      console.log('Market is open');
      this.marketColor = 'text-success';
    }
  }

  convertDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const formattedDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
    return formattedDate;
  }

  buyStock() {
    // Implement your logic for buying a stock here
  }

  sellStock() {
    // Implement your logic for selling a stock here
  }

  portfolioHasStock(): boolean {
    // Implement your logic for checking if the portfolio has the current stock
    // For now, let's return false
    return false;
  }

  addToWatchlist() {
    this.searchBarService.addToWatchlist(this.searchResults.companyDetails.ticker)
    console.log('Added to watchlist');
    this.isInWatchlist = true;
  }

  removeFromWatchlist() {
    this.searchBarService.removeFromWatchlist(this.searchResults.companyDetails.ticker)
    console.log('Removed from watchlist');
    this.isInWatchlist = false;
    // Implement your logic for removing the stock from the watchlist
  }

	open(content: TemplateRef<any>) {
    this.purchaseMessage = '';
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
        console.log('Closed with: ', result);
			}
		);
	}

  purchaseStocks(quantity: number) {
    // Validate the quantity
    if (quantity <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }
    // TODO: Implement the logic to purchase the stocks
    // This could involve calling a service method to make a HTTP request to your server
    this.purchaseMessage = `${this.searchResults.companyDetails.ticker} bought successfully`;
    console.log(`Purchased ${quantity} stocks`);

    setTimeout(() => {
      this.close();
    }, 5000);
  }

  totalPurchase() {
    console.log('totalPurchase');
    console.log(this.quantity);
    console.log(this.searchResults.companyQuote.c);
    return this.quantity * this.searchResults.companyQuote.c;
  }

  limitCheck() {
    let limit = 25000;
    let totalPurchase = this.totalPurchase();
    if (totalPurchase > limit) {
      return true;
    }
    return false;
  }

  close() {
    this.purchaseMessage = '';
  }

  
}

