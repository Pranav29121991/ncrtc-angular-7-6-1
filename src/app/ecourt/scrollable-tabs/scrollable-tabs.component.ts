import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'scrollable-tabs',
  templateUrl: './scrollable-tabs.component.html',
  styleUrls: ['./scrollable-tabs.component.scss']
})
export class ScrollableTabsComponent implements OnInit {
  @Input() tabs;
  
  constructor() { }

  ngOnInit() {
   
  }

 

}