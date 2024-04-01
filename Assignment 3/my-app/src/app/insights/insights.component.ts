import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as Highcharts from 'highcharts';
import {  HighchartsChartModule } from 'highcharts-angular'; 
import { Options } from 'highcharts';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.css'
})
export class InsightsComponent {
  @Input() searchResults: any;
  highchartsRec: any;  
  chartOptionsRec: any;
  highchartsHist: any;
  chartOptionsHist: any;

  ngOnInit() {
    console.log('Insights Component Initialized');
    console.log(this.searchResults);

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
