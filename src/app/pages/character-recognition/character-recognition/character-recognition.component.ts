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

    public imgSize?: number;

    public isCanUpload: boolean = true;

    public accept: string = 'image/*';

    public displayCustom: boolean = false;

    public imgFile?: ImgFile;

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
}
