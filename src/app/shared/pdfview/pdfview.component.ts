import { Component, OnInit, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router, Navigation } from '@angular/router';
@Component({
  selector: 'ds-pdfview',
  templateUrl: './pdfview.component.html',
  styleUrls: ['./pdfview.component.scss']
})
export class PdfviewComponent implements OnInit, AfterViewInit {
  path: string = "";
  constructor(private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private router: Router,
  ) { 
    this._document.getElementById('headerhide').remove();
    this._document.getElementById('bredhide').remove();
    this._document.getElementById('innerremove').style.removeProperty('padding-left');
    this._document.getElementById('menubarhide').remove();
    
    
    this._document.getElementById('fotterremove').remove();
    
    Array.from(document.querySelectorAll('.main-content')).forEach((el) => el.classList.remove('main-content'));
    this.route.queryParamMap.subscribe(queryParams => {
      let URLDATA = queryParams.get("file") + "&item=" + queryParams.get("itemid");
     // console.log(decodeURI(URLDATA))
      this.path = decodeURI(URLDATA)
      this._document.getElementById('titleID').innerHTML = decodeURIComponent(queryParams.get("item"));
    })
  }

  ngOnInit(): void {
    
  

  }
  ngAfterViewInit() { 
    if (isPlatformBrowser(this.platformId)) {
      this._document.getElementById('innerremove').style.setProperty('padding-left', '0px');
    }
  }
}
