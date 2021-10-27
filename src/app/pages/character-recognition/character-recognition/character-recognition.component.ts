import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';

@Component({
    selector: 'app-character-recognition',
    templateUrl: './character-recognition.component.html',
    styleUrls: ['./character-recognition.component.scss']
})
export class CharacterRecognitionComponent implements OnInit {

    @Input()
    public imgSize?: number;

    @Input()
    public multiple: boolean = false;

    @Input()
    public isCanUpload: boolean = true;

    @Input()
    public maxImgNumber?: number;

    @Input()
    public isDownloadable: boolean = false;

    @Input()
    public isDeletable: boolean = true;

    @Input()
    public imgPreviewSize: number = 900;

    @Input()
    public resourceKey: string = '';

    @Input()
    public resourceId: string = '0';

    @Output()
    public readonly onSelect: EventEmitter<any> = new EventEmitter();

    @Output()
    public readonly onRemove: EventEmitter<any> = new EventEmitter();

    @Output()
    public readonly onError: EventEmitter<any> = new EventEmitter();

    public accept: string = 'image/*';

    public activeIndex?: number;

    public displayCustom: boolean = false;

    public imgFiles: Array<ImgFile> = [];

    public resourceName: string = 'basis/filestorage/FileManagement';

    @ViewChild('file', { static: false })
    public file?: ElementRef;

    public constructor(
        private sanitizer: DomSanitizer,
    ) { }

    public async ngOnInit(): Promise<void> {
    }

    public click(): void {
        (this.file?.nativeElement as HTMLElement).click();
    }

    public async onFileSelect(event: Event): Promise<void> {
        let selectFileList: FileList | null = (event.target as HTMLInputElement).files;
        let selectFiles: Array<FileUpload> = new Array<FileUpload>();
        if (!selectFileList) {
            return;
        }
        for (let i: number = 0; i < selectFileList.length; i++) {
            if (this.maxImgNumber && this.imgFiles.length == this.maxImgNumber - 1) {
                this.isCanUpload = false;
            }
            if (!this.verifying(selectFileList[i])) {
                return;
            }
            let file: ImgFile = { file: selectFileList[i], url: this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(selectFileList[i]))) };

            let fileManagement: FileManagement = {
                id: '',
                fileType: selectFileList[i].type,
                fileSize: this.fileManagementService.formatSize(selectFileList[i].size),
                resourceId: this.resourceId,
                resourceKey: this.resourceKey,
            };
            fileManagement.fileName = file.name = selectFileList[i].name;
            let resfileManagement: FileManagement = await this.fileManagementService.createAsync(fileManagement);
            if (resfileManagement.uploadUrl) {
                (await this.fileManagementService.upload(resfileManagement.uploadUrl, file.file!)).subscribe(async (e: HttpEvent<any>) => {
                    if (e.type == HttpEventType.Response) {
                        await this.fileManagementService.updateStatus(resfileManagement.id);
                    }
                });
                file.isImg = true;
                selectFiles.push(file);
                this.imgFiles.push(file);
            }
        }
        this.onSelect.emit({ originalEvent: event, files: this.imgFiles, currentFiles: selectFiles });
    }

    public toView(index: number): void {
        this.activeIndex = index;
        this.displayCustom = true;
    }

    public async download(id: string): Promise<void> {
        const downloadUrl: string | null = await this.fileManagementService.getDownloadUrl(id);
        if (downloadUrl) {
            let a: HTMLAnchorElement = document.createElement('a');
            let e: MouseEvent = document.createEvent('MouseEvents');
            e.initEvent('click', false, false);
            a.href = downloadUrl;
            a.dispatchEvent(e);
            a.remove();
        }
    }

    public async remove(index: number, id?: string): Promise<void> {
        this.onRemove.emit({ removeFile: this.imgFiles[index] });
        if (id) {
            await this.resService.deleteAsync(this.resourceName, id);
        }
        if (this.imgFiles && this.imgFiles.length > 0) {
            this.imgFiles.splice(index, 1);
        }
        if (this.maxImgNumber && this.imgFiles.length < this.maxImgNumber) {
            this.isCanUpload = true;
        }
    }

    public whetherUploadComplete(): boolean {
        if (this.imgFiles && this.imgFiles.filter(item => item.id === undefined).length > 0) {
            return false;
        }
        return true;
    }

    public async refresh(resourceId: string): Promise<void> {
    }

    private isSameFileName(file: File): boolean {
        for (let img of this.imgFiles) {
            if (img.file && img.name === file.name) {
                return true;
            }
        }
        return false;
    }

    private verifying(file: File): boolean {
        if (this.isSameFileName(file)) {
            this.onError.emit({ error: { no: '1', value: 'Duplicate file names' } });
            return false;
        }

        if (this.imgSize && file.size > this.imgSize * 1024) {
            this.onError.emit({ error: { no: '2', value: 'Over the maximum upload size' } });
            return false;
        }

        if (this.maxImgNumber && this.maxImgNumber < this.imgFiles.length + 1) {
            this.onError.emit({ error: { no: '3', value: 'Exceed maximum quantity' } });
            return false;
        }
        return true;
    }

}
