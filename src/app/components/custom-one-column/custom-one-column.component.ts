import { BaseColumnComponent } from '@agencycoda/mia-table';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-one-column',
  templateUrl: './custom-one-column.component.html',
  styleUrls: ['./custom-one-column.component.scss']
})
export class CustomOneColumnComponent extends BaseColumnComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}