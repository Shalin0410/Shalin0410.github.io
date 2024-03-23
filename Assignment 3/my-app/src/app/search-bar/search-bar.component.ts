import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {SearchBarService} from '../service/search-bar.service';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';



@Component({
  selector: 'app-search-bar',
  standalone: true,
  providers: [SearchBarService],
  imports: [FormsModule, CommonModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe, MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  searchQuery: string = '';
  @Output() searchEvent = new EventEmitter<string>();
  autocompleteSuggestions: any[] = [];
  companyDetails: any;
  showAutocomplete: boolean = false;


  constructor(private searchBarService: SearchBarService) { }

  errorMessage: string = '';

  executeSearch() {
    // Implement the logic to execute the search based on the searchQuery
    // Make an HTTP call to the backend to retrieve stock details
    if (this.searchQuery.trim() === '') {
      console.log('Please enter a valid ticker');
      this.searchEvent.emit('Please enter a valid ticker');
    } else {
      console.log(this.searchQuery);
      this.searchEvent.emit(this.searchQuery);
    }
  }

  onSearchInput() {
    // Implement the logic to fetch autocomplete suggestions based on the searchQuery
    // Make an HTTP call to the autocomplete API endpoint
    // this.searchBarService.searchCompanies(this.searchQuery).subscribe((data: any) => {
    //   this.autocompleteSuggestions = data.filter((suggestion: any) => !suggestion.symbol.includes('.'));
    //   this.showAutocomplete = true;
    //   console.log(this.autocompleteSuggestions);
    // });
    // console.log(this.searchQuery);
  }

  clearResults() {
    // Implement the logic to clear the currently displayed search results
    this.searchQuery = '';
    this.autocompleteSuggestions = [];
    this.showAutocomplete = false;
  }

  selectSuggestion(suggestion: any) {
    // Implement the logic to select a suggestion from the autocomplete list
    this.searchQuery = suggestion.symbol;
    this.showAutocomplete = false;
    this.executeSearch();
  }
}
