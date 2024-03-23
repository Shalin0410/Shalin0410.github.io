import { Routes } from '@angular/router';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { SearchAndErrorComponent } from './search-and-error/search-and-error.component';


export const routes: Routes = [
    { path: '', component: SearchAndErrorComponent },
    { path: 'search/:symbol', component: SearchAndErrorComponent},
    { path: 'watchlist', component: WatchlistComponent },
    { path: 'portfolio', component: PortfolioComponent }
];
