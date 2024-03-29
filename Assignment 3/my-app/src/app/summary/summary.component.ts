import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as Highcharts from 'highcharts';
import indicators from 'highcharts/indicators/indicators';
import volumeByPrice from 'highcharts/indicators/volume-by-price';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsStock from 'highcharts/modules/stock';
import HC_stock from 'highcharts/modules/stock';
import {  HighchartsChartModule } from 'highcharts-angular'; 
HC_stock(Highcharts);

interface StockData {
  t: number;
  o: number;
  h: number;
  l: number;
  pc: number;
}

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, RouterModule, HighchartsChartModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})

export class SummaryComponent implements OnInit {
  @Input() searchResults: any;
  Highcharts: typeof Highcharts = Highcharts; // required
  chartOptions: Highcharts.Options = {}; // initialize chartOptions

  ngOnInit() {
    // this.chartOptions = {
    //   series: [{
    //     type: 'line',
    //     data: this.searchResults.companyHourlyCharts.map((item: StockData) => [item.t * 1000, item.o, item.h, item.l, item.pc])
    //   }],
    //   title: {
    //     text: 'Stock Price Variation'
    //   },
    //   xAxis: {
    //     type: 'datetime'
    //   },
    //   yAxis: {
    //     title: {
    //       text: 'Price'
    //     }
    //   }
    // };
  }
}
