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
import { SearchResultsService } from '../service/search-result.service';
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
  isMarketOpen: boolean = false;
  intervalId: any;
  marketColor: string = '';
  private subscription: Subscription = new Subscription();
  private modalService = inject(NgbModal);
	closeResult = '';
  quantity: number = 0;
  purchaseMessage: string = '';
  isLoading: boolean = true;
  typeMsg: string = '';

  constructor(private searchBarService: SearchBarService, private searchResultService: SearchResultsService) {}

  ngOnInit() {
    console.log('Company Details Component Initialized');
    this.checkMarketStatus();
    if (this.isMarketOpen) {
      this.searchBarService.getCompanyQuote(this.searchResults.companyDetails.ticker).subscribe(companyQuote => {
        console.log('Received companyQuote');
        this.searchResults.companyQuote = this.formatNumbersInObject(companyQuote);
        this.searchResultService.setResults(this.searchResults);
      });
    }
    console.log('Company Details searchResults:', this.searchResults);
    this.isLoading = false;
    this.subscription = interval(1500000).subscribe(() => {
      console.log('Checking market status');
      console.log('searchQuery:', this.searchResults);
      if (this.isMarketOpen) {
        this.searchBarService.getCompanyQuote(this.searchResults).subscribe(companyQuote => {
          console.log('Received companyQuote');
          this.searchResults.companyQuote = this.formatNumbersInObject(companyQuote);
          this.searchResultService.setResults(this.searchResults);
        });
      }
      this.checkMarketStatus();
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
        this.isMarketOpen = false;
        this.searchResults.isMarketOpen = false;
      } else {
        this.market = 'Market is open';
        this.isMarketOpen = true;
        this.searchResults.isMarketOpen = true;
      }
      this.getMarketColor();
      this.searchResultService.setResults(this.searchResults);
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

  addToWatchlist() {
    console.log('Company Details Add Watchlist')
    this.searchBarService.addToWatchlist(this.searchResults.companyDetails.ticker, this.searchResults.companyDetails.name)
    console.log('Company Details Added to watchlist');
    if (!this.searchResults.watchlist) {
      this.searchResults.watchlist = [];
    }
    this.searchResults.watchlist.push({ symbols: this.searchResults.companyDetails.ticker, name: this.searchResults.companyDetails.name });
    this.searchResults.isInWatchlist = true;
    this.purchaseMessage = `${this.searchResults.companyDetails.ticker} added to Watchlist`;
    this.typeMsg = 'success';
    this.searchResultService.setResults(this.searchResults);
  }

  removeFromWatchlist() {
    console.log('Company Details Remove from Watchlist');
    console.log('Check searchResults:', this.searchResults);
    this.searchBarService.removeFromWatchlist(this.searchResults.companyDetails.ticker);
    console.log('Company Details Removed from watchlist');
    console.log('Before:', this.searchResults.companyWatchlist);
    this.searchResults.watchlist = this.searchResults.companyWatchlist.filter((company: any) => company.symbols !== this.searchResults.companyDetails.ticker);
    console.log('After:', this.searchResults.watchlist);
    this.searchResults.isInWatchlist = false;
    this.purchaseMessage = `${this.searchResults.companyDetails.ticker} removed from Watchlist`;
    this.typeMsg = 'danger';
    this.searchResultService.setResults(this.searchResults);
  }

	open(content: TemplateRef<any>) {
    this.purchaseMessage = '';
		this.modalService.open(content).result.then(
			(result) => {

				this.closeResult = `Closed with: ${result}`;
        console.log('Closed with: ', result);
			}
		);
	}

  purchaseStocks(quantity: number) {
    let stockInPortfolio = {symbols: '', name: '', quantity: 0, totalCost: ''};
    // Validate the quantity
    if (quantity <= 0) {
      this.purchaseMessage = 'Please enter a valid quantity';
      this.typeMsg = 'danger';
      return;
    }
    // TODO: Implement the logic to purchase the stocks
    // This could involve calling a service method to make a HTTP request to your server
    console.log('Purchasing stocks');
    console.log('Quantity:', quantity);
    console.log('Total Cost:', this.totalPurchase());

    stockInPortfolio = this.updatePortfolio(stockInPortfolio, quantity, this.totalPurchase());
    this.searchBarService.addToPortfolio(stockInPortfolio.symbols, stockInPortfolio.name, stockInPortfolio.quantity, stockInPortfolio.totalCost);
    this.searchResults.wallet = (parseFloat(this.searchResults.wallet) - parseFloat(this.totalPurchase())).toFixed(2);
    console.log('Wallet:', this.searchResults.wallet);
    this.searchBarService.updateToWallet(this.searchResults.wallet);
    this.purchaseMessage = `${this.searchResults.companyDetails.ticker} bought successfully`;
    this.typeMsg = 'success';
    this.searchResults.isInPortfolio = true;
    this.searchResultService.setResults(this.searchResults);
    console.log(`Purchased ${quantity} stocks`);

    setTimeout(() => {
      this.close();
    }, 5000);
  }

  updatePortfolio(stockInPortfolio:any, quantity: number, totalCost: string) {
    const symbol = this.searchResults.companyDetails.ticker;
    const name = this.searchResults.companyDetails.name;

    stockInPortfolio = this.searchResults.companyPortfolio.find((stock: any) => stock.symbols === symbol);

    if (stockInPortfolio) {
      const index = this.searchResults.companyPortfolio.indexOf(stockInPortfolio);
      stockInPortfolio.quantity += quantity;
      stockInPortfolio.totalCost = (parseFloat(stockInPortfolio.totalCost) + parseFloat(totalCost)).toFixed(2);
      this.searchResults.companyPortfolio[index] = stockInPortfolio;
    }
    else {
      stockInPortfolio = { symbols: symbol, name: name, quantity: quantity, totalCost: totalCost };
      this.searchResults.companyPortfolio.push(stockInPortfolio);
    }
    return stockInPortfolio;
  }

  totalPurchase() {
    return (this.quantity * this.searchResults.companyQuote.c).toFixed(2);
  }

  limitCheck() {
    let limit = this.searchResults.wallet;
    let totalPurchase = this.totalPurchase();
    if (parseFloat(totalPurchase) > limit) {
      return true;
    }
    return false;
  }

  sellStocks(quantity: number) {
    let stockInPortfolio = {symbols: '', name: '', quantity: 0, totalCost: ''};
    // Validate the quantity
    if (this.quantity <= 0) {
      this.purchaseMessage = 'Please enter a valid quantity';
      this.typeMsg = 'danger';
      return;
    }
    console.log('Selling stocks');
    console.log('Quantity:', quantity);
    console.log('Total Sale:', this.totalSale());
    
    stockInPortfolio = this.updateSellPortfolio(stockInPortfolio, quantity, this.totalSale());
    this.searchBarService.addToPortfolio(stockInPortfolio.symbols, stockInPortfolio.name, stockInPortfolio.quantity, stockInPortfolio.totalCost);
    this.searchResults.wallet = (parseFloat(this.searchResults.wallet) + parseFloat(this.totalPurchase())).toFixed(2);
    console.log('Wallet:', this.searchResults.wallet);
    this.searchBarService.updateToWallet(this.searchResults.wallet);
    console.log('Stock Quantity:', stockInPortfolio.quantity);
    if (stockInPortfolio.quantity <= 0) {
      this.searchResults.isInPortfolio = false;
      this.searchResults.companyPortfolio = this.searchResults.companyPortfolio.filter((stock: any) => stock.symbols !== stockInPortfolio.symbols);
      this.searchBarService.deleteFromPortfolio(stockInPortfolio.symbols);
    }
    this.purchaseMessage = `${this.searchResults.companyDetails.ticker} sold successfully`;
    this.typeMsg = 'danger';
    this.searchResultService.setResults(this.searchResults);
    console.log(`Sold ${quantity} stocks`);

    setTimeout(() => {
      this.close();
    }, 5000);
  }

  updateSellPortfolio(stockInPortfolio:any, quantity: number, totalCost: string) {
    const symbol = this.searchResults.companyDetails.ticker;
    const name = this.searchResults.companyDetails.name;

    stockInPortfolio = this.searchResults.companyPortfolio.find((stock: any) => stock.symbols === symbol);

    if (stockInPortfolio) {
      const index = this.searchResults.companyPortfolio.indexOf(stockInPortfolio);
      if (typeof stockInPortfolio.quantity !== 'undefined') {
        stockInPortfolio.quantity -= quantity;
        stockInPortfolio.totalCost = (parseFloat(stockInPortfolio.totalCost) - parseFloat(totalCost)).toFixed(2);
        this.searchResults.companyPortfolio[index] = stockInPortfolio;
      }
    }
    return stockInPortfolio;
  }

  totalSale() {
    return (this.quantity * this.searchResults.companyQuote.c).toFixed(2);
  }

  quantityCheck(quantity: number) {
    let stockInPortfolio = this.searchResults.companyPortfolio.find((stock: any) => stock.symbols === this.searchResults.companyDetails.ticker)
    if (stockInPortfolio) {
      let limitquantity = stockInPortfolio.quantity;
      if (quantity > limitquantity) {
        if (limitquantity <= 0){
          this.searchResults.isInPortfolio = false;
        }
        return true;
      }
    }
    return false;
  }

  close() {
    this.purchaseMessage = '';
  }

  
}

