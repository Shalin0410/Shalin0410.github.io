import { Component, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchBarService } from '../service/search-bar.service';
import { SearchResultsService } from '../service/search-result.service';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, FormsModule, NgbAlertModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent {
  isLoading: boolean = true;
  portfolioStocks: any = [];
  balance: string = '';
  message: string = '';
  typeMsg: string = '';
  quantity: number = 0;
  selectedStock: any = {};
  constructor(private searchBarService:SearchBarService, private searchResultsService:SearchResultsService, private modalService: NgbModal) {}
  private modalSubject = new Subject<any>();
  openModal$ = this.modalSubject.asObservable();
  
  ngOnInit() {
    console.log('Portfolio Component Initialized');
    this.message = '';
    this.searchBarService.getPortfolio().subscribe((portfolio: any) => {
      console.log('Received watchlist');
      console.log('Portfolio:', portfolio);
      portfolio.forEach((stock: any) => {
        this.searchBarService.getCompanyQuote(stock.symbols).subscribe(companyQuote => {
          companyQuote = this.formatNumbersInObject(companyQuote);
          this.portfolioStocks.push({ tickerSymbol: stock.symbols, companyName: stock.name, quantity: stock.quantity, totalCost: stock.totalCost, avgCost: stock.avgCost, quote: companyQuote});
        });
      });
      this.searchBarService.getWalletBalance().subscribe((balance: any) => {
        console.log('Received balance');
        console.log('Balance:', balance);
        this.balance = balance;
        this.isLoading = false;
        console.log('Portfolio:', this.portfolioStocks);
      });
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

  openDetails(symbol: string) {
    console.log('Portfolio Opening details for:', symbol);
    let state = this.searchResultsService.getResults();
    console.log('State:', state);
    state.companyDetails.ticker = symbol;
    console.log('State:', state);
    state.callApiOnce = false;
    this.searchResultsService.setResults(state);
    // this.router.navigate(['/search', symbol]);
  }

  costPerShare(totalCost: any, quantity: any){
    return (parseFloat(totalCost)/parseFloat(quantity)).toFixed(2)
  }

  calcChange(totalCost: any, quantity:any, currentPrice: any){
    return (parseFloat(this.costPerShare(totalCost,quantity)) - parseFloat(currentPrice)).toFixed(2)
  }

  calcMarketVal(currentPrice: any, quantity: any){
    return (parseFloat(currentPrice) * parseFloat(quantity)).toFixed(2)
  }

  openBuyModal(buyModal: TemplateRef<any>, stock: any) {
    this.selectedStock = stock;
    console.log('Opening buy modal for:', this.selectedStock);    
    this.message = '';
    this.modalService.open(buyModal, { size: 'lg', backdrop: 'static' }).result.then((result) => {
      console.log('Closed with:', result);
    }, (reason) => {
      console.log('Dismissed with:', reason);
    });
  }

  openSellModal(sellModal: TemplateRef<any>, stock: any) {
    this.selectedStock = stock;
    console.log('Opening sell modal for:', this.selectedStock);    
    this.message = '';
    this.modalService.open(sellModal, { size: 'lg', backdrop: 'static' }).result.then((result) => {
      console.log('Closed with:', result);
    }, (reason) => {
      console.log('Dismissed with:', reason);
    });
  }

  totalPurchase(stock: any) {
    return (this.quantity * stock.quote.c).toFixed(2);
  }

  limitCheck(balance: any, stock: any) {
    let limit = balance;
    let totalPurchase = this.totalPurchase(stock);
    if (parseFloat(totalPurchase) > limit) {
      return true;
    }
    return false;
  }

  purchaseStocks(stock:any, quantity: number) {
    let stockInPortfolio: any = {};
    // Validate the quantity
    if (quantity <= 0) {
      this.message = 'Please enter a valid quantity';
      this.typeMsg = 'danger';
      return;
    }
    // TODO: Implement the logic to purchase the stocks
    // This could involve calling a service method to make a HTTP request to your server
    console.log('Purchasing stocks');
    console.log('Quantity:', quantity);
    console.log('Total Cost:', this.totalPurchase(stock));

    stockInPortfolio = this.updatePortfolio(stock, quantity);
    console.log('Stock in Portfolio:', stockInPortfolio);
    this.searchBarService.addToPortfolio(stockInPortfolio.tickerSymbol, stockInPortfolio.companyName, stockInPortfolio.quantity, stockInPortfolio.totalCost);
    this.balance = (parseFloat(this.balance) - parseFloat(this.totalPurchase(stockInPortfolio))).toFixed(2);
    console.log('Wallet:', this.balance);
    this.searchBarService.updateToWallet(this.balance);
    this.message = `${stockInPortfolio.symbols} bought successfully`;
    this.typeMsg = 'success';
    console.log(`Purchased ${quantity} stocks`);

    setTimeout(() => {
      this.close();
    }, 5000);
  }

  updatePortfolio(stock: any, quantity: number) {
    stock.quantity += quantity;
    stock.totalCost = (parseFloat(stock.totalCost) + parseFloat(this.totalPurchase(stock))).toFixed(2);
    return stock;
  }

  sellStocks(stock: any, quantity: number) {
    let stockInPortfolio: any = {};
    // Validate the quantity
    if (this.quantity <= 0) {
      this.message = 'Please enter a valid quantity';
      this.typeMsg = 'danger';
      return;
    }
    console.log('Selling stocks');
    console.log('Quantity:', quantity);
    console.log('Total Sale:', this.totalSale(stock));
    
    stockInPortfolio = this.updateSellPortfolio(stock, quantity);
    console.log('Selling Stock in Portfolio:', stockInPortfolio);
    this.searchBarService.addToPortfolio(stockInPortfolio.tickerSymbol, stockInPortfolio.companyName, stockInPortfolio.quantity, stockInPortfolio.totalCost);
    this.balance = (parseFloat(this.balance) + parseFloat(this.totalSale(stock))).toFixed(2);
    console.log('Wallet:', this.balance);
    this.searchBarService.updateToWallet(this.balance);
    console.log('Stock Quantity:', stockInPortfolio.quantity);
    if (stockInPortfolio.quantity <= 0) {
      this.searchBarService.deleteFromPortfolio(stockInPortfolio.tickerSymbol);
    }
    this.message = `${stockInPortfolio.tickerSymbol} sold successfully`;
    this.typeMsg = 'danger';
    console.log(`Sold ${quantity} stocks`);

    setTimeout(() => {
      this.close();
    }, 5000);
  }

  updateSellPortfolio(stock:any, quantity: number) {
    stock.quantity -= quantity;
    stock.totalCost = (parseFloat(stock.totalCost) - ((parseFloat(stock.avgCost))*quantity)).toFixed(2);
    return stock;
  }

  totalSale(stock: any) {
    return (this.quantity * stock.quote.c).toFixed(2);
  }

  quantityCheck(stock:any, quantity: number) {
    let limitquantity = stock.quantity;
    if (quantity > limitquantity) {
      return true;
    }
    return false;
  }

  getArrow(totalCost: any, quantity:any, currentPrice: any){
    let change =  parseFloat(this.calcChange(totalCost, quantity, currentPrice));
    if (change > 0) {
      return 'bi bi-caret-up-fill me-1';
    } else if (change < 0) {
      return 'bi bi-caret-down-fill me-1';
    } else {
      return '';
    }
  }

  getColor(totalCost: any, quantity:any, currentPrice: any) {
    let change =  parseFloat(this.calcChange(totalCost, quantity, currentPrice));
    if (change > 0) {
      return 'col-4 text-success';
    } else if (change < 0) {
      return 'col-4 text-danger';
    } else {
      return 'col-4 text-dark';
    }
  }

  close() {
    this.message = '';
  }

}
