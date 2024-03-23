import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-headernav-bar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './headernav-bar.component.html',
  styleUrl: './headernav-bar.component.css'
})
export class HeadernavBarComponent {

  // searchWithSymbol() {
  //   const searchQuery = (document.getElementById('searchQuery') as HTMLInputElement).value;
  //   //this.router.navigate(['/search', searchQuery]);
  // }

}
