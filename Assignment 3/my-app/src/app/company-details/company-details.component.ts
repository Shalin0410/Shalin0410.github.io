import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchAndErrorComponent } from '../search-and-error/search-and-error.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SearchBarService } from '../service/search-bar.service';
import { SummaryComponent } from '../summary/summary.component';
import { TopNewsComponent } from '../top-news/top-news.component';
import { ChartsComponent } from '../charts/charts.component';
import { InsightsComponent } from '../insights/insights.component';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';

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
    InsightsComponent],
  providers: [SearchBarService],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.css'
})
export class CompanyDetailsComponent {
  @Input() searchResults: any;
  @Input() searchQuery: string = '';
  market: string = '';
  intervalId: any;
  marketColor: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private searchBarService: SearchBarService) {}

  ngOnInit() {
    this.subscription = interval(150000000).subscribe(() => {
      console.log('Checking market status');
      console.log('searchQuery:', this.searchQuery);
      this.searchBarService.getCompanyQuote(this.searchQuery).subscribe(companyQuote => {
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
}
