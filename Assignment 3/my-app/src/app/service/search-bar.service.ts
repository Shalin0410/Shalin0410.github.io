import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; // Import the Observable class
import { HttpClient } from '@angular/common/http'; // Import the HttpClient module

@Injectable({
  providedIn: 'root'
})
export class SearchBarService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { } // Inject the HttpClient module

  searchCompanies(companyName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/?q=${companyName}`);
  }

  getCompanyDetails(symbol: string): Observable<any> {
    console.log('getCompanyDetails');
    console.log(symbol);
    return this.http.get(`${this.apiUrl}/search/${symbol}`);
  }
}
