import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CharacterRecognitionComponent } from './character-recognition/character-recognition.component';
import { CharacterRecognitionRoutingModule } from './character-recognition/character-recognition-routing.module';



@NgModule({

    imports: [NzUploadModule, CharacterRecognitionRoutingModule, CommonModule],
    exports: [CharacterRecognitionComponent],
    declarations: [
        CharacterRecognitionComponent
    ],
})
export class CharacterRecognitionModule { }
