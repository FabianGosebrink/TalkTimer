import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-total-time',
  templateUrl: './total-time.component.html',
  styleUrls: ['./total-time.component.css']
})
export class TotalTimeComponent implements OnInit {
  @Input() totalTime = 0;
  @Input() totalPercentage = 0;
  constructor() {}

  ngOnInit() {}
}
