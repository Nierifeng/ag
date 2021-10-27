import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CharacterRecognitionComponent } from './character-recognition.component';

const routes: Routes = [
  { path: '', component: CharacterRecognitionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CharacterRecognitionRoutingModule { }
