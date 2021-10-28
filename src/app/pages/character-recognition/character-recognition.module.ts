import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CharacterRecognitionRoutingModule } from './character-recognition/character-recognition-routing.module';
import { CharacterRecognitionComponent } from './character-recognition/character-recognition.component';



@NgModule({

    imports: [NzUploadModule, CharacterRecognitionRoutingModule, CommonModule, NzIconModule],
    exports: [CharacterRecognitionComponent],
    declarations: [
        CharacterRecognitionComponent
    ],
})
export class CharacterRecognitionModule { }
