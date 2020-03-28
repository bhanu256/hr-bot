import { Component, OnInit } from '@angular/core';
import { DataShareService } from '../data-share.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  mes = ""

  constructor(public serve : DataShareService) { }

  ngOnInit() {
    this.mes = this.serve.error
  }

}
