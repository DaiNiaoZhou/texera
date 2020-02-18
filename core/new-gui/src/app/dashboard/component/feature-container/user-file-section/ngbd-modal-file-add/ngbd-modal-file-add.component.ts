import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { UserFileUploadService } from '../../../../service/user-file/user-file-upload.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadItem } from '../../../../type/file-upload-item';

@Component({
  selector: 'texera-ngbd-modal-file-add',
  templateUrl: './ngbd-modal-file-add.component.html',
  styleUrls: ['./ngbd-modal-file-add.component.scss']
})
export class NgbdModalFileAddComponent implements OnInit {

  // This checks whether the user has hover a file over the file upload area
  public haveDropZoneOver: boolean = false;

  // uploader is a data type introduced in ng2-uploader library, which can be used to capture files and store them
  //  inside the uploader queue.
  public uploader: FileUploader = new FileUploader({url: ''});


  constructor(
    public activeModal: NgbActiveModal,
    private userFileUploadService: UserFileUploadService
    ) { }

  ngOnInit() {
  }

  public getFileArray(): FileUploadItem[] {
    return this.userFileUploadService.getFileArray();
  }

  public getFileArrayLength(): number {
    return this.userFileUploadService.getFileArrayLength();
  }

  public deleteFile(fileUploadItem: FileUploadItem): void {
    this.userFileUploadService.deleteFile(fileUploadItem);
  }

  public uploadAllFiles() {
    this.userFileUploadService.uploadAllFiles();
  }

  public haveFileOver(fileOverEvent: boolean): void {
    this.haveDropZoneOver = fileOverEvent;
  }

  public getFileDropped(fileDropEvent: FileList): void {
    for (let i = 0; i < fileDropEvent.length; i++) {
      const fileOrNull: File | null = fileDropEvent.item(i);
      if (this.isFile(fileOrNull) ) {
        this.userFileUploadService.insertNewFile(fileOrNull);
      }
    }

    this.uploader.clearQueue();
  }

  public handleClickUploadFile(clickUploadEvent: {target: HTMLInputElement}): void {
    const filelist: FileList | null = clickUploadEvent.target.files;
    if (filelist === null) {
      throw new Error(`browser upload does not work as intended`);
    }

    for (let i = 0; i < filelist.length; i++) {
      this.userFileUploadService.insertNewFile(filelist[i]);
    }
  }

  private isFile(file: File | null): file is File {
    return file != null;
  }


}
