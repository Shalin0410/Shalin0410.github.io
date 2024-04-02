import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import {  HighchartsChartModule } from 'highcharts-angular'; 
import { Options } from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
import HC_indicators from 'highcharts/indicators/indicators';
import HC_vbp from 'highcharts/indicators/volume-by-price';
HC_stock(Highcharts);
HC_indicators(Highcharts);
HC_vbp(Highcharts);

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent implements OnInit{
  @Input() searchResults: any;
  highcharts: any;  
  chartOptions: any;
  groupingUnits: any;
  ohlc: any = [];
  volume: any = [];
  dataLength: any;
  data: any;

  ngOnInit() {
    console.log('Charts Component Initialized');
    console.log(this.searchResults);
    this.data = this.searchResults.companyCharts.results;
    console.log(this.data[0]);
    this.dataLength = this.searchResults.companyCharts.results.length;
    this.groupingUnits = [[
      'week',                        
      [1]                            
    ], [
      'month',
      [1, 2, 3, 4, 6]
    ]];
    const twoYearsAgo = Date.now() - (2 * 365 * 24 * 3600 * 1000);
    for (let i = 0; i < this.dataLength; i += 1) {
      this.ohlc.push([
          this.data[i].t, // the date
          this.data[i].o, // open
          this.data[i].h, // high
          this.data[i].l, // low
          this.data[i].c // close
      ]);

      this.volume.push([
        this.data[i].t, // the date
        this.data[i].v // the volume
      ]);
    }
    this.highcharts = Highcharts;  
    this.chartOptions = {
      rangeSelector: {
        enabled: true,
        inputEnabled: true,
        buttons: [{
            type: 'month',
            count: 1,
            text: '1m',
        }, {
            type: 'month',
            count: 3,
            text: '3m',
        }, {
            type: 'month',
            count: 6,
            text: '6m',
        }, {
            type: 'ytd',
            text: 'YTD',
        }, {
            type: 'year',
            count: 1,
            text: '1y',
        }, {
            type: 'all',
            text: 'All',
        }],
        selected: 2
      },

      title: {
          text: this.searchResults.companyDetails.ticker + ' Historical'
      },

      subtitle: {
          text: '<p>With SMA and Volume by Price technical indicators<p>',
          useHTML: true
      },

      legend: {
          enabled: false
      },

      xAxis: {
        ordinal: true,
        type: 'datetime',
      },

      yAxis: [{
          startOnTick: false,
          endOnTick: false,
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: 'OHLC'
          },
          height: '60%',
          lineWidth: 2,
          resize: {
              enabled: true
          },
          opposite: true
      }, {
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: 'Volume'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
          opposite: true
      }],

      tooltip: {
          split: true
      },

      plotOptions: {
          series: {
            pointWidth: 4,
            pointPlacement: 'on',
            dataGrouping: {
                units: this.groupingUnits
            }
          }
      },

      series: [{
          type: 'candlestick',
          name: 'Comapny Ticker',
          id: 'company',
          zIndex: 2,
          data: this.ohlc
      }, {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: this.volume,
          yAxis: 1
      }, {
          type: 'vbp',
          linkedTo: 'company',
          params: {
              volumeSeriesID: 'volume'
          },
          dataLabels: {
              enabled: false
          },
          zoneLines: {
              enabled: false
          }
      }, {
          type: 'sma',
          linkedTo: 'company',
          zIndex: 1,
          marker: {
              enabled: false
          }
      }],
      navigator: {
        enabled: true,
        series: {
            accessibility: {
                exposeAsGroupOnly: true
            }
        }
      }
    };
  }
}
