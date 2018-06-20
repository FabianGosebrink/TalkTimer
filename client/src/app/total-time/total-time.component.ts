import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  Input,
  OnInit
} from '@angular/core';
import * as stickfill from 'stickyfilljs';

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

@Directive({
  selector: '[appStickyPolyfill]'
})
export class StickyPolyFillDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    stickfill.addOne(this.elementRef.nativeElement);
  }
}
