import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as Highcharts from 'highcharts';
import {  HighchartsChartModule } from 'highcharts-angular'; 
import { Options } from 'highcharts';
import { SearchResultsService } from '../service/search-result.service';
// import HC_stock from 'highcharts/modules/stock';
// HC_stock(Highcharts);


@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, RouterModule, HighchartsChartModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})

export class SummaryComponent implements OnInit {
  @Input() searchResults: any;
  highcharts: any;  
  chartOptions: any;

  constructor(private search: SearchResultsService) {};
  
  
  ngOnInit() {
    console.log('Summary Component Initialized');
    console.log(this.searchResults);
    this.highcharts = Highcharts;  
    this.chartOptions = {
      chart: {
        backgroundColor: 'rgba(211, 211, 211, 0.3)',
      },
      title: {
        text: this.searchResults.companyDetails.ticker + ' Hourly Price Variation',
        style: {
          color: 'grey',
        }
      },
      legend: {
        enabled: false
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        startOnTick: false,
        endOnTick: false,
        title: {
          text: ''
        },
        opposite: true,
      },
      plotOptions: {
        line: {
            marker: {
                enabled: false
            },
            zones: [{
                color: this.searchResults.isMarketOpen ? 'green' : 'red'
              }]
        }
      },
      series: [{
        data: this.searchResults.companyHourlyCharts.results.map((result: any) => [result.t, result.c]),
        type: 'line'
      }],
    };
  }

  getSymbol(symbol: string) {
    console.log('Summary Symbol:', symbol);
    this.searchResults.companyDetails.ticker = symbol;
    this.searchResults.callApiOnce = false;
    this.search.setResults(this.searchResults);
  }
}

