import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoStreamingComponent } from './components/video-streaming.component';

@NgModule({
    imports: [CommonModule],
    declarations: [
        VideoStreamingComponent
    ],
    exports: [
        VideoStreamingComponent
    ]
})
export class VideoStreamingModule {}