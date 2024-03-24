import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; // Import the Observable class
import { HttpClient } from '@angular/common/http'; // Import the HttpClient module

@Injectable({
  providedIn: 'root'
})
export class SearchBarService {
  private apiUrl = 'http://localhost:3000';
  public currentSearchQuery: string = '';

  constructor(private http: HttpClient) { }

  setCurentSearchQuery(searchQuery: string) {
    this.currentSearchQuery = searchQuery;
  }

  searchCompanies(companyName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/?q=${companyName}`);
  }

  getCompanyDetails(symbol: string): Observable<any> {
    console.log('getCompanyDetails');
    console.log(symbol);
    return this.http.get(`${this.apiUrl}/search/${symbol}`);
  }
}
