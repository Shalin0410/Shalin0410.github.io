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
    NgbAlertModule],
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
    companyChart: {}
  };
  showAutocomplete: boolean = false;
  errorMessage: string = '';

  constructor(private searchBarService: SearchBarService, private router: Router, private route: ActivatedRoute, private searchResultsService: SearchResultsService) { 
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event) => {
      console.log('NavigationEnd:', event);
      const path = this.route.snapshot.routeConfig?.path;
      console.log('path:', path);
      if (path === 'search/:symbol') {
        const symbol = this.route.snapshot.params['symbol'];
        console.log('symbol:', symbol);
        let prevQuery = this.searchQuery;
        this.searchQuery = symbol;
        const results = this.searchResultsService.getResults();
        if (prevQuery == this.searchQuery && results) {
          this.searchResults = results;
        } else {
          this.executeSearch();
        }
      }
    }
    )
  }

  ngOnInit() {
    console.log('Search and Error Component Initialized');
    console.log('searchResults:', this.searchResults);
    this.searchResults.companyDetails = {};
    const path = this.route.snapshot.routeConfig?.path;
    console.log('path:', path);
    
    if (path === 'search/:symbol') {
      const symbol = this.route.snapshot.params['symbol'];
      console.log('symbol:', symbol);
      this.searchQuery = symbol;
      const results = this.searchResultsService.getResults();
      if (results) {
        this.searchResults = results;
      } else {
        this.executeSearch();
      }
    }
  }

  onSearch() {
    console.log('searchQuery:', this.searchQuery);
    console.log('onSearch');
    if (this.errorMessage !== 'Please enter a valid ticker') {
      this.searchBarService.getAllDetails(this.searchQuery).subscribe(data => {
        this.searchResults.companyDetails = data[0];
        this.searchResults.companyQuote = data[1];
        this.searchResults.companyNews = data[2];
        this.searchResults.companyRecommendations = data[3];
        this.searchResults.companySentiments = data[4];
        this.searchResults.companyPeers = data[5];
        this.searchResults.companyEarnings = data[6];
        this.searchResults.companyCharts = data[7];
        if (Object.keys(this.searchResults.companyDetails).length === 0) {
          this.errorMessage = 'No data found. Please enter a valid ticker';
          console.log('Error Message: ', this.errorMessage);
        } else {
          this.searchResultsService.setResults(this.searchResults, this.searchQuery);
        }
      });
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
      this.onSearch();
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
