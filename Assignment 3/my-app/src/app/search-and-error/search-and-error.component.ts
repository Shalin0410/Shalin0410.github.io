import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CompanyDetailsComponent } from '../company-details/company-details.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Router, NavigationEnd} from '@angular/router';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { SearchBarService } from '../service/search-bar.service';
import {SearchResultsService} from '../service/search-result.service';
import { filter } from 'rxjs/operators';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-search-and-error',
  standalone: true,
  providers: [SearchBarService, SearchResultsService],
  imports: [
    FormsModule, 
    CommonModule, 
    MatAutocompleteModule, 
    ReactiveFormsModule,  
    MatIconModule, 
    MatInputModule, 
    MatFormFieldModule, 
    CompanyDetailsComponent,
    NgbAlertModule,
    MatProgressSpinnerModule],
  templateUrl: './search-and-error.component.html',
  styleUrl: './search-and-error.component.css'
})
export class SearchAndErrorComponent {
  searchQuery: string = '';
  autocompleteSuggestions: any[] = [];
  searchResults: any = {
    companyDetails: {},
    companyQuote: {},
    companyNews: {},
    companyRecommendations: {},
    companySentiments: {},
    companyPeers: {},
    companyEarnings: {},
    companyCharts: {},
    companyHourlyCharts: {}
  };
  showAutocomplete: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private searchBarService: SearchBarService, private router: Router, private route: ActivatedRoute, private searchResultsService: SearchResultsService) { 
  }

  ngOnInit() {
    this.errorMessage = '';
    console.log('Search and Error Component Initialized');
    //console.log('searchResults:', this.searchResults);

    const symbol = this.route.snapshot.paramMap.get('symbol');
    console.log('symbol:', symbol);
    if (symbol) {
      this.searchQuery = symbol;
      const results = this.searchResultsService.getResults();
      if (results) {
        this.searchResults = results;
      } else {
        this.executeSearch();
      }
    } else {
      this.searchResults.companyDetails = {};
    }

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      filter(() => this.route.snapshot.paramMap.has('symbol'))
    ).subscribe(() => {
      const symbol = this.route.snapshot.paramMap.get('symbol');
      console.log('Symbol:', symbol);
      console.log('Search Query:', this.searchQuery);
      if (symbol !== null && symbol !== this.searchQuery) {
        this.searchQuery = symbol;
        this.executeSearch();
      }
    });
  }

  onSearch() {
    console.log('searchQuery:', this.searchQuery);
    console.log('onSearch');
    if (this.errorMessage !== 'Please enter a valid ticker') {
      this.searchBarService.getAllDetails(this.searchQuery).subscribe(data => {
        this.searchResults.companyDetails = this.formatNumbersInObject(data[0]);
        this.searchResults.companyQuote = this.formatNumbersInObject(data[1]);
        this.searchResults.companyNews = data[2]; // Assuming this is not numeric data
        this.searchResults.companyRecommendations = this.formatNumbersInObject(data[3]);
        this.searchResults.companySentiments = this.formatNumbersInObject(data[4]);
        this.searchResults.companyPeers = data[5]; // Assuming this is not numeric data
        this.searchResults.companyEarnings = this.formatNumbersInObject(data[6]);
        this.searchResults.companyCharts = this.formatNumbersInObject(data[7]);
        this.searchResults.companyHourlyCharts = this.formatNumbersInObject(data[8]);
        if (Object.keys(this.searchResults.companyDetails).length === 0) {
          this.errorMessage = 'No data found. Please enter a valid ticker';
          console.log('Error Message: ', this.errorMessage);
        } else {
          console.log('Setting search results');
          this.searchResultsService.setResults(this.searchResults, this.searchQuery);
        }
      });
    }
  }

  formatNumbersInObject(obj: any) {
    for (let key in obj) {
      if (typeof obj[key] === 'number') {
        obj[key] = parseFloat(obj[key].toFixed(2));
      }
    }
    return obj;
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
      this.onSearch();
    }
  }

  onSearchInput() {
    // Implement the logic to fetch autocomplete suggestions based on the searchQuery
    // Make an HTTP call to the autocomplete API endpoint
    if (this.searchQuery.length > 0) {
      console.log('Search Query:', this.searchQuery);
      console.log('Fetching autocomplete suggestions');
      this.isLoading = true; // Add the 'isLoading' property to the class
      console.log(this.isLoading);
      this.searchBarService.searchCompanies(this.searchQuery).subscribe((data: any) => {
        this.autocompleteSuggestions = data.filter((suggestion: any) => (!suggestion.symbol.includes('.') && suggestion.type.includes('Common Stock')));
        //this.showAutocomplete = true;
        this.isLoading = false; // Set 'isLoading' to false after the data is fetched
        console.log(this.isLoading);
      });
    } else {
      this.autocompleteSuggestions = [];
      //this.showAutocomplete = false;
    }
    
    // console.log(this.searchQuery);
  }

  isEmpty(obj: any) {
    return Object.keys(this.searchResults.companyDetails).length === 0;
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

  close() {
    this.errorMessage = '';
  }
}
