import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchAndErrorComponent } from '../search-and-error/search-and-error.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SummaryComponent } from '../summary/summary.component';
import { TopNewsComponent } from '../top-news/top-news.component';
import { ChartsComponent } from '../charts/charts.component';
import { InsightsComponent } from '../insights/insights.component';


@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [
    NgbAlertModule, 
    CommonModule, 
    SearchAndErrorComponent, 
    MatTabsModule, 
    SummaryComponent, 
    TopNewsComponent, 
    ChartsComponent, 
    InsightsComponent],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.css'
})
export class CompanyDetailsComponent {
  @Input() companyDetails: any;
  market: string = '';
  intervalId: any;
  marketColor: string = '';

  ngOnInit() {
    const currentTimestamp = Date.now();

    console.log('currentTimestamp:', currentTimestamp);

    if (this.companyDetails && this.companyDetails.t) {
      const difference = currentTimestamp - this.companyDetails.t * 1000;
      console.log('difference:', difference);

      if (difference > 300000) {
        console.log('Market is closed');
        this.market = 'Market is closed on ' + (this.companyDetails.t);
      } else {
        console.log('Market is open');
        this.market = 'Market is open';
      }
      this.getMarketColor();
    }

    this.intervalId = setInterval(() => this.checkMarketStatus(), 15000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  checkMarketStatus() {
    console.log('Checking market status');
    const currentTimestamp = Date.now();

    console.log('currentTimestamp:', currentTimestamp);

    if (this.companyDetails && this.companyDetails.t) {
      const difference = currentTimestamp - this.companyDetails.t * 1000;

      if (difference > 300000) {
        console.log('Market is closed');
        this.market = 'Market is closed on ' + (this.companyDetails.t);
      } else {
        console.log('Market is open');
        this.market = 'Market is open';
      }
      this.getMarketColor();
    }
  }

  getMarketColor() {
    if (this.market === 'Market is closed') {
      this.marketColor = 'text-danger';
    } else {
      this.marketColor = 'text-success';
    }
  }
}
