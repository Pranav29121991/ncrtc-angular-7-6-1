
import { Location } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { METADATA_IMPORT_SCRIPT_NAME, ScriptDataService } from '../../core/data/processes/script-data.service';
import { ProcessParameter } from '../../process-page/processes/process-parameter.model';
import { isNotEmpty } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteData } from '../../core/data/remote-data';
import { Process } from '../../process-page/processes/process.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { getProcessDetailRoute } from '../../process-page/process-page-routing.paths';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'ds-dms-upload',
  templateUrl: './dms-upload.component.html',
  styleUrls: ['./dms-upload.component.scss']
})
export class DmsUploadComponent {
  /**
     * The current value of the file
     */
  fileObject: File;

  /**
   * The validate only flag
   */
  validateOnly = true;

  public constructor(private location: Location,
    protected translate: TranslateService,
    protected notificationsService: NotificationsService,
    private scriptDataService: ScriptDataService,
    private router: Router,
    private http: HttpClient,
    public sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef) {
  }

  /**
   * Set file
   * @param file
   */
  setFile(file) {
    debugger;
    this.fileObject = file;
  }

  /**
   * When return button is pressed go to previous location
   */
  public onReturn() {
    this.location.back();
  }

  /**
   * Starts import-metadata script with -f fileName (and the selected file)
   */
  getsafeURL(url): any {
    //return url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
   
  }
  public importMetadata() {
    if (this.fileObject == null) {
      this.notificationsService.error(this.translate.get('admin.metadata-import.page.error.addFile'));
    } else {
      var formData: any = new FormData();
      formData.append('file', this.fileObject);
      this.http.post('http://localhost:91/uploadfile', formData, {
        headers: {
          'Content-Type': 'file'
        },
}).subscribe((response) => {
        console.log('File uploaded successfully', response);
      }, (error) => {
        console.error('Error uploading file:', error);
      });
    }
  }
}
