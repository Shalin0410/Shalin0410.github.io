import { Injectable } from '@angular/core';
import { Observable, catchError, from, of, forkJoin } from 'rxjs'; // Import the Observable class
import { HttpClient } from '@angular/common/http'; // Import the HttpClient module

@Injectable({
  providedIn: 'root'
})
export class SearchBarService {
  private apiUrl = 'http://localhost:3000';
  public currentSearchQuery: string = 'home';
  private searchResults: any;

  constructor(private http: HttpClient) { 
    this.searchResults = {
      companyDetails: null,
      companyQuote: null,
      companyNews: null,
      companyRecommendations: null,
      companySentiments: null,
      companyPeers: null,
      companyEarnings: null,
      companyCharts: null,
      companyHourlyCharts: null
    };
  }

  // changeSearchQuery(searchQuery: string) {
  //   console.log('changeSearchQuery called with: ', searchQuery);
  //   this.currentSearchQuery = searchQuery;
  // }

  // getCurrentSearchQuery() {
  //   console.log('getCurrentSearchQuery called with: ', this.currentSearchQuery);
  //   return this.currentSearchQuery;
  // }

  // setCurentSearchQuery(searchQuery: string) {
  //   this.currentSearchQuery = searchQuery;
  // }

  searchCompanies(companyName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/?q=${companyName}`);
  }

  getAllDetails(symbol: string) {
    console.log('getAllDetails'); 
    console.log(symbol);
    const companyDetails = this.http.get(`${this.apiUrl}/search/${symbol}`).pipe(catchError(error => of({})));
    const companyQuote = this.http.get(`${this.apiUrl}/quote/${symbol}`).pipe(catchError(error => of({})));
    const companyNews = this.http.get(`${this.apiUrl}/news/${symbol}`).pipe(catchError(error => of({})));
    const companyRecommendations = this.http.get(`${this.apiUrl}/recommendation/${symbol}`).pipe(catchError(error => of({})));
    const companySentiments = this.http.get(`${this.apiUrl}/sentiment/${symbol}`).pipe(catchError(error => of({})));
    const companyPeers = this.http.get(`${this.apiUrl}/peers/${symbol}`).pipe(catchError(error => of({})));
    const companyEarnings = this.http.get(`${this.apiUrl}/earnings/${symbol}`).pipe(catchError(error => of({})));
    const companyCharts = this.http.get(`${this.apiUrl}/charts/${symbol}`).pipe(catchError(error => of({})));
    const companyHourlyCharts = this.http.get(`${this.apiUrl}/hourlyCharts/${symbol}`).pipe(catchError(error => of({})));
    return forkJoin([companyDetails, companyQuote, companyNews, companyRecommendations, companySentiments, companyPeers, companyEarnings, companyCharts, companyHourlyCharts]);
  }

  getCompanyQuote(symbol: string) {
    return this.http.get(`${this.apiUrl}/quote/${symbol}`);
  }
  
}
