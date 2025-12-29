import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import p5 from 'p5';
import { take } from 'rxjs';
import { DocumenttypeTreeService } from 'src/app/core/data/documenttypetree.service';
import { RemoteData } from 'src/app/core/data/remote-data';
import { DocumentTypeTree } from 'src/app/core/shared/documenttypetree.model';
import { getFirstCompletedRemoteData } from 'src/app/core/shared/operators';

@Component({
  selector: 'ds-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements AfterViewInit {
  @Input() pdfSrc;
  smartnote: boolean = false;
  sketchpadCheckBox = new FormControl(true);
  isSkatchpad: boolean = true;
  noteinfo :string = '';
  canvasDataString:any =[];
  usePen:boolean = true;

  public noteText= new FormControl();
  private p5Instance: p5;

  constructor(
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private documenttypeTreeService: DocumenttypeTreeService,
  ) {}

  ngAfterViewInit() {
    window.addEventListener('storage', () => {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);

        // Check if the key contains the pattern 'bitstreams'
        if (key.includes('addednote')) {
           
          // Push the UUID into the array
          const data = localStorage.getItem(key);
          this.noteinfo = data;
          if (this.noteinfo.includes(this.pdfSrc)) {
            const parts = this.noteinfo.split('?');

            // Extract the part after '?'
            const queryString = parts[1];
            this.genratesmartnote();
            localStorage.removeItem(key);
          }
        }
      }
    });
  }

  genratesmartnote() {
    debugger;
    this.smartnote = !this.smartnote;
    this.cdRef.detectChanges();  // <== Force UI update
  
    if (!this.smartnote) return;
  
    this.retrieveCanvasData();
  }
  

  penColor : string = '#0000ff';
  isEraser : boolean = false;
  setPenColor(color: string) {
    if(color === '#ffffff') {
      this.isEraser = true;
    } else {
      this.isEraser = false;
    }
    this.penColor = color;
  }

  retrieveCanvasData() {
    this.isSkatchpad = true;
    this.cdRef.detectChanges();
    // this.p5Instance.noCanvas();
    this.canvasDataString = this.parsedData(localStorage.getItem(this.noteinfo));
    if (!!this.canvasDataString && this.canvasDataString !== null) {
      if (this.canvasDataString !== null) {
        
        for (const i of this.canvasDataString) {
          const canvasKeys = Object.keys(i).filter(key => key.includes('canvas'));
          if (canvasKeys && canvasKeys.length > 0) {
            this.sketchpadCheckBox.setValue(true);
            // this.createP5Instance(i);
          } else {
            this.isSkatchpad = false;
            this.cdRef.detectChanges();
            this.sketchpadCheckBox.setValue(false);
            this.noteText.patchValue(this.canvasDataString[0].text);
            let data :any =[];
            data.push({text:this.noteText.value});
           localStorage.setItem(this.noteinfo,JSON.stringify(data));
          }
        }
      } else {
        this.createP5Instance(this);
      }
    } else {
      this.createP5Instance(this);
    }
  }

  parsedData(data: any) {
    while (typeof data !== 'object') {
      try {
        data = JSON.parse(data);
      } catch (error) {
        console.error('Parsing failed:', error);
        break;
      }
    }
    return data;
  }

  sketchpadChangeEvent(event,modal) {
    this.modalService.open(modal).result.then(
      (result) => {
        if (result === 'ok') {
          if(event.target.checked) {
            this.isSkatchpad = true;
            this.cdRef.detectChanges();
            localStorage.removeItem(this.noteinfo);
            this.canvasDataString = null;
            this.createCanvas();
          } else {
            this.canvasDataString = null;
            this.isSkatchpad = false;
            this.noteText.patchValue('');
            // this.p5Instance.noCanvas();
            this.cdRef.detectChanges();
            let data :any =[];
           data.push({text:this.noteText.value});
          localStorage.removeItem(this.noteinfo);
          localStorage.setItem(this.noteinfo,JSON.stringify(data));
          // this.saveNotes();
          }
        } else {
          if(event.target.checked) {
            event.target.checked = false
          } else {
            event.target.checked = true;
          }
        }
      });
  }

  createCanvas(): void {
    this.createP5Instance(this);
  }

  createP5Instance(data: any) {
    if (typeof window !== 'undefined') {
      import('p5').then((p5) => {
        // this.p5Instance = new p5.default(this.sketch.bind(this, data), this.canvasContainer.nativeElement);
      });
    }
  }

  noteTextInput(event: any) {
    let data :any =[]
     data.push({text:this.noteText.value});
    localStorage.setItem(this.noteinfo,JSON.stringify(data));
    this.saveNotes();
  }

  saveNotes() {
    var note = localStorage.getItem(this.noteinfo);
    const idRegex = /\/bitstreams\/([a-f0-9-]+)\/content/;

    // Executing the regular expression on the URL
    const match = this.noteinfo.match(idRegex);
    var uuidArrayNote: any = [];
    var uuid: string = '';
    var uuidArray = [];
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);

      // Check if the key contains the pattern 'bitstreams'
      if (key.includes(match[1])) {
        // Push the UUID into the array
        if (key.includes("?page-")) {
          const substringRegex = /\?([^?]+)$/;
          const match1 = key.match(substringRegex);
          const data = localStorage.getItem(key);
          const obj = {};
          obj[match1[1]] = data;
          uuidArrayNote.push(obj);
        }
        if (key.includes("content_page_fabric")) {
          const data = localStorage.getItem(key);
          uuidArray.push(data);
        }
        if (key.includes("uuid")) {
          const data2 = localStorage.getItem(key);
          uuid = data2;
        }
      }

    }
    var data = {};
    data = {
      bitstreamRest: {
        uuid: match[1]
      },
      pdfannotationStr: JSON.stringify(uuidArray),
      noteannotatiostr: JSON.stringify(uuidArrayNote),
      uuid: uuid
    };
    this.documenttypeTreeService.saveAnnotation(data).pipe(
      getFirstCompletedRemoteData(),
      take(1)
    ).subscribe((response: RemoteData<DocumentTypeTree>) => {
    });
  }

  usePenChangeEvent(event:any) {
    this.usePen = !this.usePen;
  }

}
