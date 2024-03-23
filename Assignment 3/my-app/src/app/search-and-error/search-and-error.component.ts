import { Component } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { SearchBarService } from '../service/search-bar.service';

@Component({
  selector: 'app-search-and-error',
  standalone: true,
  providers: [SearchBarService],
  imports: [SearchBarComponent, ErrorMessageComponent],
  templateUrl: './search-and-error.component.html',
  styleUrl: './search-and-error.component.css'
})
export class SearchAndErrorComponent {
  companyDetails: any;
  errorMessage: string = '';

  constructor(private searchBarService: SearchBarService) { }

  onSearch(searchQuery: string) {
    this.errorMessage = '';
    console.log('onSearch');
    if (searchQuery === 'Please enter a valid ticker') {
      this.errorMessage = 'Please enter a valid ticker';
    } else {
      this.searchBarService.getCompanyDetails(searchQuery).subscribe(
        (data: any) => {
          console.log('YOLO:', data);
          if (!data || Object.keys(data).length === 0) {
            console.log('No data found. Please enter a valid ticker');
            this.errorMessage = 'No data found. Please enter a valid ticker';
          } else {
            this.companyDetails = data;
          }
        }
      );
    }
  }
}
