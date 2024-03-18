import { Component } from '@angular/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { SearchBarService } from '../../service/search-bar.service';


@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [NgbTypeaheadModule, FormsModule, JsonPipe],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  // model: any;

	// search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
	// 	text$.pipe(
	// 		debounceTime(200),
	// 		distinctUntilChanged(),
	// 		map((term) =>
	// 			term.length < 1 ? [] : tickerSymbol.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
	// 		),
	// 	);

}
