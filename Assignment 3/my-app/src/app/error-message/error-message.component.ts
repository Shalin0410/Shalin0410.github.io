import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule, NgbAlertModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css'
})

export class ErrorMessageComponent {
  @Input() message: string = '';

  close() {
    this.message = '';
  }


}
