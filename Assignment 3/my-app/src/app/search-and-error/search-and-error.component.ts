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
import { SearchResultsService } from '../service/search-result.service';
import { filter } from 'rxjs/operators';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-search-and-error',
  standalone: true,
  providers: [SearchBarService],
  imports: [
    FormsModule, 
    CommonModule, 
    MatAutocompleteModule, 
    ReactiveFormsModule,  
    MatIconModule, 
    MatInputModule, 
    MatFormFieldModule, 
    NgbAlertModule,
    MatProgressSpinnerModule,
    CompanyDetailsComponent],
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
    companyHourlyCharts: {},
    companyWatchlist: [],
    wallet: "",
    isInWatchlist: false,
    companyPortfolio: [],
    isInPortfolio: false,
    isMarketOpen: false,
    callApiOnce: false
  };
  showAutocomplete: boolean = false;
  errorMessage: string = '';
  typeMsg: string = '';
  isLoading: boolean = false;
  isLoadingSearch: boolean = false;

  constructor(private searchBarService: SearchBarService, private router: Router, private route: ActivatedRoute, private searchResultsService: SearchResultsService) { 
  }

  ngOnInit() {
    this.errorMessage = '';
    // Get the ticker symbol from the URL parameters
    
    // If the ticker symbol exists, execute a search for it
    // this.route.params.subscribe(params => {
    //   const companyToken = params['symbol'];
    //   console.log('Company Token:', companyToken);

    //   if (companyToken && companyToken !== this.searchQuery) {
    //     console.log('Searching from another tab and not the same company');
    //     this.searchQuery = companyToken;
    //     this.onSearch();
    //   }
    // });
    console.log('Search and Error Component Initialized Before');
    console.log('Route:', this.router.url);
    this.searchResultsService.stateValue.subscribe((state: any) => {
      console.log('Search and Error Component State:', state);
      console.log('Search Results:', this.searchResults);
      if (state.companyCharts.ticker === state.companyDetails.ticker) {
        this.searchQuery = state.companyDetails.ticker;
        this.searchResults = state;
        this.router.navigate(['/search', this.searchQuery]);
      } else {
        this.searchQuery = state.companyDetails.ticker;
        console.log('Search Query:', this.searchQuery);
        this.executeSearch();
      }
    });
      // if (state) {
      //   this.searchResults = state;
      // } 
      // if (this.searchQuery !== state.companyDetails.ticker) {
      //   this.searchQuery = state.companyDetails.ticker;
      //   console.log('Search Query:', this.searchQuery);
      //   this.router.navigate(['/search', this.searchQuery]);
      // }
    // });
    console.log('Search and Error Component Initialized After');
    //console.log('searchResults:', this.searchResults);
  }

  onSearch() {
    console.log('searchQuery:', this.searchQuery);
    console.log('onSearch');
    if (this.errorMessage !== 'Please enter a valid ticker' && this.searchResults.callApiOnce === false) {
      this.isLoadingSearch = true;
      this.searchBarService.getAllDetails(this.searchQuery).subscribe(data => {
        this.searchResults.companyDetails = this.formatNumbersInObject(data[0]);
        this.searchResults.companyQuote = this.formatNumbersInObject(data[1]);
        this.searchResults.companyNews = (data[2] as Array<any>)
        .filter(news => news.image && news.image !== "")
        .slice(0, 20);
        this.searchResults.companyRecommendations = this.formatNumbersInObject(data[3]);
        this.searchResults.companySentiments = this.formatNumbersInObject(data[4]);
        this.searchResults.companyPeers = data[5]; // Assuming this is not numeric data
        this.searchResults.companyEarnings = this.formatNumbersInObject(data[6]);
        this.searchResults.companyCharts = this.formatNumbersInObject(data[7]);
        this.searchResults.companyHourlyCharts = this.formatNumbersInObject(data[8]);
        this.searchResults.companyWatchlist = data[9];
        this.searchResults.wallet = data[10];
        this.searchResults.isInWatchlist = this.searchResults.companyWatchlist.some((company: any) => company.symbols === this.searchResults.companyDetails.ticker);
        this.searchResults.companyPortfolio = data[11];
        this.searchResults.isInPortfolio = this.searchResults.companyPortfolio.some((stock: any) => stock.symbols === this.searchResults.companyDetails.ticker && stock.quantity > 0);
        this.searchResults.callApiOnce = true;
        console.log('Wallet: ', data[10]);
        console.log('Wallet:', this.searchResults.wallet);
        if (Object.keys(this.searchResults.companyDetails).length === 0) {
          this.errorMessage = 'No data found. Please enter a valid ticker';
          this.typeMsg = 'danger';
          console.log('Error Message: ', this.errorMessage);
          this.searchResultsService.setResults(this.searchResults);
        } else {
          this.errorMessage = '';
          this.searchResultsService.setResults(this.searchResults);
        }
      });
    }
    this.isLoadingSearch = false;
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
      this.typeMsg = 'danger';

    } else {
      console.log(this.searchQuery);
      console.log('Routing to search page');
      this.onSearch();
      this.router.navigate(['/search', this.searchQuery]);
    }
  }

  onSearchInput() {
    // Implement the logic to fetch autocomplete suggestions based on the searchQuery
    // Make an HTTP call to the autocomplete API endpoint
    if (this.searchQuery && this.searchQuery.length > 0) {
      //console.log('Search Query:', this.searchQuery);
      //console.log('Fetching autocomplete suggestions');
      this.isLoading = true; // Add the 'isLoading' property to the class
      //console.log(this.isLoading);
      this.searchBarService.searchCompanies(this.searchQuery).subscribe((data: any) => {
        this.autocompleteSuggestions = data.filter((suggestion: any) => (!suggestion.symbol.includes('.') && suggestion.type.includes('Common Stock')));
        //this.showAutocomplete = true;
        this.isLoading = false; // Set 'isLoading' to false after the data is fetched
        //console.log(this.isLoading);
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
  console.log('Selected Suggestion:', suggestion);
  this.searchQuery = suggestion.symbol;
  this.showAutocomplete = false;
  this.executeSearch();
  }

  close() {
    this.errorMessage = '';
  }
}
