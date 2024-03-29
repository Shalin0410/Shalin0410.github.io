import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchResultsService {
  private searchResultsSubject = new BehaviorSubject<any>(null);
  public stateValue = this.searchResultsSubject.asObservable();

  setResults(results: any) {
    this.searchResultsSubject.next(results);
  }

  getResults(): any {
    return this.searchResultsSubject.getValue();
  }
}