import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchBarService } from '../service/search-bar.service';
import { SearchResultsService } from '../service/search-result.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent {
  isLoading: boolean = true;
  portfolioStocks: any = [];
  constructor() {}

  ngOnInit() {
    console.log('Portfolio Component Initialized');
    this.isLoading = false;
  }

  openDetails(ticker: string) {
    console.log('Opening details for:', ticker);
  }

}
