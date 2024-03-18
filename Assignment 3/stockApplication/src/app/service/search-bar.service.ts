import { Component, inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, OperatorFunction } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SearchBarService {
  private apiUrl = 'http://localhost:3000/search';

  constructor(private http: HttpClient) {}

  searchCompanies(companyName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?q=${companyName}`);
  }
}
