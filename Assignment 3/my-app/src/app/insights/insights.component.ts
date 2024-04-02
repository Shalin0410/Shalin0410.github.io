import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as Highcharts from 'highcharts';
import {  HighchartsChartModule } from 'highcharts-angular'; 
import { Options } from 'highcharts';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, RouterModule, HighchartsChartModule],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.css'
})
export class InsightsComponent {
  @Input() searchResults: any;
  highchartsRec: typeof Highcharts = Highcharts;  
  chartOptionsRec:  Highcharts.Options = {}; // Assign an initial value to chartOptionsRec
  highchartsHist: typeof Highcharts = Highcharts;
  chartOptionsHist: Highcharts.Options = {};

  ngOnInit() {
    console.log('Insights Component Initialized');
    console.log(this.searchResults);
    this.recommendationChartTable(this.searchResults);
    this.epsChartTable(this.searchResults);
  }

  recommendationChartTable(searchResults: any) {
    console.log(this.searchResults.companyRecommendations.map(((recommendation:any) => recommendation.period)));
    const Categories = this.searchResults.companyRecommendations.map(((recommendation:any) => recommendation.period));
    const StrongBuy = this.searchResults.companyRecommendations.map(((recommendation:any) => recommendation.strongBuy));
    const Buy = this.searchResults.companyRecommendations.map(((recommendation:any) => recommendation.buy));
    const Hold = this.searchResults.companyRecommendations.map(((recommendation:any) => recommendation.hold));
    const Sell = this.searchResults.companyRecommendations.map(((recommendation:any) => recommendation.sell));
    const StrongSell = this.searchResults.companyRecommendations.map(((recommendation:any) => recommendation.strongSell));
    
    this.highchartsRec = Highcharts;  
    this.chartOptionsRec = {
      chart: {
        type: 'column',
        backgroundColor: 'rgba(211, 211, 211, 0.3)',
    },
    title: {
        text: 'Recommendation Trends',
    },
    xAxis: {
        categories: Categories,
    },
    yAxis: {
        min: 0,
        title: {
            text: '#Analysis'
        },
        stackLabels: {
            enabled: false
        }
    },
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{
      type: 'column',
      name: 'Strong Buy',
      data: StrongBuy,
      color: 'rgb(26, 99, 52)'
    }, {
      type: 'column',
      name: 'Buy',
      data: Buy,
      color: 'rgb(36, 175, 81)'
    }, {
      type: 'column',
      name: 'Hold',
      data: Hold,
      color: 'rgb(176, 126, 40)'
    }, {
      type: 'column',
      name: 'Sell',
      data: Sell,
      color: 'rgb(241, 80, 83)'
    }, {
      type: 'column',
      name: 'Strong Sell',
      data: StrongSell,
      color: 'rgb(117, 43, 44)'
    }]
    };
  }

  epsChartTable(searchResults: any) {
    console.log('EPS Table: ', this.searchResults.companyEarnings.map((result: any) => [result.period, 'Surprise: ', result.surprise]));
    const Data = this.searchResults.companyEarnings.map((result: any) => [result.period + '<br>Surpise: ' + result.surprise])
    const actualEarnings = this.searchResults.companyEarnings.map((result: any) => [result.actual]);
    const estimatedEarnings = this.searchResults.companyEarnings.map((result: any) => [result.estimate]);
    this.highchartsHist = Highcharts;  
    this.chartOptionsHist = {
      chart: {
        backgroundColor: 'rgba(211, 211, 211, 0.3)',
      },
      title: {
        text: 'Historical EPS Suprises',
      },
      legend: {
        enabled: true
      },
      xAxis: {
        categories: Data,
      },
      yAxis: {
        startOnTick: false,
        endOnTick: false,
        title: {
          text: 'Quaterly EPS'
        },
      },
      series: [{
        name: 'Actual',
        data: actualEarnings,
        type: 'spline'
      }, {
        name: 'Estimate',
        data: estimatedEarnings,
        type: 'spline'
      }],
    };
    console.log('EPS Table: finished');
  }

  totalMSPR() {
    let total = 0;
    for (let data of this.searchResults.companySentiments.data){
      total += data.mspr;
    }
    return total.toFixed(2);
  }

  totalPosMSPR() {
    let total = 0;
    for (let data of this.searchResults.companySentiments.data){
      if(data.mspr > 0){
        total += data.mspr;
      }
    }
    return total.toFixed(2);
  }

  totalNegMSPR() {
    let total = 0;
    for (let data of this.searchResults.companySentiments.data){
      if(data.mspr < 0){
        total += data.mspr;
      }
    }
    return total.toFixed(2);
  }

  totalChange() {
    let total = 0;
    for (let data of this.searchResults.companySentiments.data){
      total += data.change;
    }
    return total;
  }

  totalPosChange() {
    let total = 0;
    for (let data of this.searchResults.companySentiments.data){
      if(data.change > 0){
        total += data.change;
      }
    }
    return total;
  }

  totalNegChange() {
    let total = 0;
    for (let data of this.searchResults.companySentiments.data){
      if(data.change < 0){
        total += data.change;
      }
    }
    return total;
  }

}
