import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SearchBarService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  searchTickerSymbol(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/home?q=${query}`);
  }

  getTickerSymbol(ticker: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/${ticker}`);
  }
}
