import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchResultsService {
  private results: any;
  private lastSearchedToken: string = '';

  constructor() {
    this.lastSearchedToken = '';
  }

  setResults(results: any, token: string) {
    this.results = results;
    this.lastSearchedToken = token;
  }

  getResults() {
    return this.results;
  }

  getLastSearchedToken() {
    return this.lastSearchedToken;
  }
}