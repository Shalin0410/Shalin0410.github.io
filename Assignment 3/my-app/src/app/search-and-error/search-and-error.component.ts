import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SearchBarService } from '../service/search-bar.service';
import { ActivatedRoute } from '@angular/router';
import { CompanyDetailsComponent } from '../company-details/company-details.component';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Router} from '@angular/router';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search-and-error',
  standalone: true,
  providers: [SearchBarService],
  imports: [
    FormsModule, 
    CommonModule, 
    MatAutocompleteModule, 
    ReactiveFormsModule, 
    AsyncPipe, 
    MatIconModule, 
    MatInputModule, 
    MatFormFieldModule, 
    CompanyDetailsComponent,
    NgbAlertModule],
  templateUrl: './search-and-error.component.html',
  styleUrl: './search-and-error.component.css'
})
export class SearchAndErrorComponent {
  searchQuery: string = '';
  autocompleteSuggestions: any[] = [];
  companyDetails: any;
  showAutocomplete: boolean = false;
  errorMessage: string = '';

  constructor(private searchBarService: SearchBarService, private router: Router, private route: ActivatedRoute) { }

  // ngOnInit() {
  //   const path = this.route.snapshot.routeConfig?.path;
  //   console.log('path:', path);
    
  //   if (path === 'search/home') {
  //     console.log('errorMessage:', this.errorMessage);
  //     this.companyDetails = null;
  //   } else if (path === 'search/:symbol') {
  //     const symbol = this.route.snapshot.params['symbol'];
  //     console.log('symbol:', symbol);
  //     this.searchQuery = symbol;
  //     this.executeSearch();
  //   }
  // }

async onSearch() {
    console.log('searchQuery:', this.searchQuery);
    console.log('onSearch');
    if (this.errorMessage === 'Please enter a valid ticker') {
      console.log('I was here');
      console.log(this.errorMessage);
      this.router.navigate(['/search/home']);
      //this.errorMessage = 'Please enter a valid ticker';
    } else {
      this.searchBarService.getCompanyDetails(this.searchQuery).subscribe(
        (data: any) => {
          console.log('YOLO:', data);
          if (!data || Object.keys(data).length === 0) {
            this.errorMessage = 'No data found. Please enter a valid ticker';
            console.log('Error Message: ', this.errorMessage);
          } else {
            this.companyDetails = data;
          }
        }
      );
    }
  }

  executeSearch() {
    // Implement the logic to execute the search based on the searchQuery
    // Make an HTTP call to the backend to retrieve stock details
    this.errorMessage = '';
    if (this.searchQuery.trim() === '') {
      console.log('Please enter a valid ticker');
      this.errorMessage = 'Please enter a valid ticker';
    } else {
      console.log(this.searchQuery);
      console.log('Routing to search page')
      this.router.navigate(['/search', this.searchQuery]);
    }
    this.onSearch();
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

  message: string = '';

  close() {
    this.message = '';
  }
}
