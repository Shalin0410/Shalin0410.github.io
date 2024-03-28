import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-top-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-news.component.html',
  styleUrl: './top-news.component.css'
})
export class TopNewsComponent {
  @Input() searchResults: any;
  selectedNews: any = [];
  currentNews: any;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    console.log('Top News Component Initialized');
  }

  // open(news: any, content: any) {
  //   this.currentNews = news;
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     // handle close result
  //   }, (reason) => {
  //     // handle dismiss reason
  //     if (reason === ModalDismissReasons.ESC) {
  //       console.log('Modal closed with ESC');
  //     } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //       console.log('Modal closed with backdrop click');
  //     }
  //   });
  // }

}

