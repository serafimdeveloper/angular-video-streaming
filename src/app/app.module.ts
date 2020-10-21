import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { VideoStreamingModule } from './video-streaming/video-streaning.module';

@NgModule({
  declarations: [
    AppComponent   
  ],
  imports: [
    BrowserModule,
    VideoStreamingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
