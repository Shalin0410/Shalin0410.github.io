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

  getCompanyQuote(symbol: string) {
    return this.http.get(`${this.apiUrl}/quote/${symbol}`);
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
    const companyWatchlist = this.http.get(`${this.apiUrl}/watchlist/`).pipe(catchError(error => of({})));
    const wallet = this.http.get(`${this.apiUrl}/wallet/`).pipe(catchError(error => of({})));
    console.log('Service file wallet: ', wallet);
    const companyPortfolio = this.http.get(`${this.apiUrl}/portfolio/`).pipe(catchError(error => of({})));
    return forkJoin([companyDetails, companyQuote, companyNews, companyRecommendations, companySentiments, companyPeers, companyEarnings, companyCharts, companyHourlyCharts, companyWatchlist, wallet, companyPortfolio]);
  }

  addToWatchlist(symbol: string, companyName: string) {
    console.log('Service addToWatchlist: ', symbol);
    console.log('Final call to backend: ', `${this.apiUrl}/search/add/${symbol}`);
    this.http.post(`${this.apiUrl}/search/add/${symbol}`, {symbols: symbol, name: companyName}).subscribe((data: any) => {
      console.log('Service addToWatchlist data: ', data);
    });
  }

  removeFromWatchlist(symbol: string) {
    console.log('removeFromWatchlist: ', symbol);
    this.http.delete(`${this.apiUrl}/search/delete/${symbol}`).subscribe(
      response => {
        console.log('Service removeFromWatchlist response: ', response);
      },
      error => {
        console.log('Service removeFromWatchlist error: ', error);
      }
    );
  }

  getWatchlist() {
    return this.http.get(`${this.apiUrl}/watchlist/`).pipe(catchError(error => of({})));
  }

  getPortfolio() {
    return this.http.get(`${this.apiUrl}/portfolio/`).pipe(catchError(error => of({})));
  }

  addToPortfolio(symbol: string, companyName: string, quantity: number, totalCost: string) {
    console.log('Service addToPortfolio: ', symbol);
    console.log('Final call to backend: ', `${this.apiUrl}/portfolio/add/${symbol}`);
    this.http.post(`${this.apiUrl}/portfolio/add/${symbol}`, {symbols: symbol, name: companyName, quantity: quantity, totalCost: totalCost}).subscribe((data: any) => {
      console.log('Service addToPortfolio data: ', data);
    });
  }

  deleteFromPortfolio(symbol: string) {
    console.log('Service deleteFromPortfolio: ', symbol);
    this.http.delete(`${this.apiUrl}/portfolio/delete/${symbol}`).subscribe(
      response => {
        console.log('Service deleteFromPortfolio response: ', response);
      },
      error => {
        console.log('Service deleteFromPortfolio error: ', error);
      }
    );
  }

  updateToWallet(amount: string) {
    console.log('Service updateToWallet: ', amount);
    console.log('Final call to backend: ', `${this.apiUrl}/wallet/update`);
    this.http.post(`${this.apiUrl}/wallet/update`, {balance: amount}).subscribe((data: any) => {
      console.log('Service updateToWallet data: ', data);
    });
  }


  // getWallet() {
  //   return this.http.get(`${this.apiUrl}/wallet/`).pipe(catchError(error => of({})));
  // }


  
}
