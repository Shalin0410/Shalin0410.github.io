import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchResultsService {
  private results: any;
  private lastSearchedToken: string = 'home';

  setResults(results: any, token: string) {
    //console.log('setResults:', results);
    console.log('setResults token:', token);
    this.results = results;
    this.lastSearchedToken = token;
    console.log('setResults lastSearchedToken:', this.lastSearchedToken);
  }

  getResults() {
    return this.results;
  }

  getLastSearchedToken() {
    //console.log('getLastSearchedToken:', this.lastSearchedToken);
    return this.lastSearchedToken;
  }
}