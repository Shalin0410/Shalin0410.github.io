import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { NgbTypeaheadConfig, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchBarService } from '../../service/search-bar.service';
import { Observable, OperatorFunction, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  providers: [SearchBarService, NgbTypeaheadConfig],
  imports: [NgbTypeaheadModule, FormsModule, JsonPipe, HttpClientModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
	model: any;
	searching = false;
	searchFailed = false;

	constructor(private searchService: SearchBarService, private config: NgbTypeaheadConfig) {
		this.config.showHint = true;
	}

	search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
	text$.pipe(
		debounceTime(300),
		distinctUntilChanged(),
		tap(() => (this.searching = true)),
		switchMap((term) =>
			this.searchService.searchCompanies(term).pipe(
				tap(results => {
					console.log('Results from searchService:', results);
				}),
				tap(() => (this.searchFailed = false)),
				catchError(() => {
					console.log('Error from searchService');
					this.searchFailed = true;
					return of([]);
				})
			)
		),
		tap(() => (this.searching = false))
	);
}
