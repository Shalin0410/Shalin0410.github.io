import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef } from '@angular/core';

@Component({
  selector: 'app-top-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-news.component.html',
  styleUrl: './top-news.component.css'
})
export class TopNewsComponent {
  @Input() searchResults: any;
  selectedNews: any = {};
  currentNews: any;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    console.log('Top News Component Initialized');
  }

  openNewsModal(newsModal: TemplateRef<any>, news: any) {
    console.log('Opening news modal');
    console.log(news);
    this.selectedNews = news;
    this.modalService.open(newsModal, { size: 'lg' }).result.then((result) => {
      console.log('Modal closed');
    }, (reason) => {
      console.log('Modal dismissed');
    });
  }

  convertDate(timestamp: any) {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
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

