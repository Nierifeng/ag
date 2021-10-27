import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

interface ImgFile {
    file: File,
    name: string,
    url: string,
}

@Component({
    selector: 'app-character-recognition',
    templateUrl: './character-recognition.component.html',
    styleUrls: ['./character-recognition.component.scss']
})
export class CharacterRecognitionComponent implements OnInit {

    @Input()
    public imgSize?: number;

    @Input()
    public isCanUpload: boolean = true;

    @Input()
    public maxImgNumber?: number;

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
    }

    public toView(index: number): void {
        this.activeIndex = index;
        this.displayCustom = true;
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
