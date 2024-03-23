import { Component } from '@angular/core';
import { BrowserAnimationsModule  } from '@angular/platform-browser/animations';
//import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {SearchBarService} from '../../service/search-bar.service';

export interface Company {
	description: string;
	displaySymbol: string;
	symbol: string;
	type: string;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  providers: [SearchBarService],
  imports: [ReactiveFormsModule, MatAutocompleteModule, HttpClientModule, BrowserAnimationsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
	searchQuery: string = '';
	autocompleteSuggestions: Company[] = []; 
	searchControl = new FormControl('');
	// searching = false;
	// searchFailed = false;

	constructor(private searchService: SearchBarService) {}

	fetchAutocompleteSuggestions() { 
		this.searchService.searchCompanies(this.searchQuery).subscribe((suggestions) => 
		{ 
			console.log('Autocomplete suggestions:', suggestions);
			this.autocompleteSuggestions = suggestions; 
			console.log('Autocomplete suggestions:', this.autocompleteSuggestions);
		}); 
	}

	search() {
		console.log('Searching for:', this.searchQuery);
	}

	clear() {
		this.searchQuery = '';
	}
	

	// search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
	// text$.pipe(
	// 	debounceTime(300),
	// 	distinctUntilChanged(),
	// 	tap(() => (this.searching = true)),
	// 	switchMap((term) =>
	// 		this.searchService.searchCompanies(term).pipe(
	// 			map(results => results.map((result: any) => ({symbol: result.symbol, desc: result.description}))),
	// 			tap(results => {
	// 				console.log('Results from searchService:', results);
	// 			}),
	// 			tap(() => (this.searchFailed = false)),
	// 			catchError(() => {
	// 				console.log('Error from searchService');
	// 				this.searchFailed = true;
	// 				return of([]);
	// 			})
	// 		)
	// 	),
	// 	tap(() => (this.searching = false))
	// );
}
