import { Component, OnInit, ViewChild, ElementRef, 
  EventEmitter, Input, AfterViewInit, Output } from '@angular/core';

import { StreamingService } from '../providers/streaming.service';

import { ConfigText } from '../models/configText';
import { StatusStream } from '../models/statusStream';
import { TypeCamera } from '../models/typeCamera';


@Component({
  selector: 'app-video-streaming',
  templateUrl: './video-streaming.component.html',
  styleUrls: ['./video-streaming.component.css']
})
export class VideoStreamingComponent implements AfterViewInit, OnInit{

  @ViewChild('myVideo')
  myVideo: ElementRef<HTMLVideoElement>;

  @Input() source: string = '';
  @Input() timeout = 120;
  @Input() configText: ConfigText = {
    record: 'gravar',
    stop: 'pausar',
    rewrite: 'regravar',
    upload: 'upload',
    preview: 'visualizar',
    messageSuccess: 'Seu vídeo foi gravado com sucesso!'
  };

  @Output()
  error: EventEmitter<any> = new EventEmitter();
  @Output()
  upload: EventEmitter<any> = new EventEmitter();

  controls: boolean;
  blob: Blob;
  status: number;
  typeCamera: string;
  stream: MediaStream;
  countdown: string;

  constructor(private streamingService: StreamingService) { }

  ngOnInit(): void {
    this.streamingService.timeVideoObservable$.subscribe(res => this.countdown = res);
    this.streamingService.listenTimeOut$.subscribe(async () => this.clickStop() )
  }

  async ngAfterViewInit(): Promise<void> {

    console.log(this.myVideo);
    if(this.source) {
     this.startVideo(this.source, true);
    } else {
      await this.clickStart();
    }

    this.myVideo.nativeElement.onended = (e) => {
      console.log(e);
      this.controls = true;
      this.myVideo.nativeElement.controls = false;
    }
  }

  get statusInicial(): boolean {
    return this.status === StatusStream.INITIAL;
  }

  get statusAndamento(): boolean {
    return this.status === StatusStream.PROGRESS;
  }

  get statusFinalizado(): boolean {
    return this.status === StatusStream.FINISHED;
  }

  async clickStart(): Promise<void> {
    try {
      this.controls = true;
      if (!this.stream) {
        this.countdown = this.streamingService.convertTime(this.timeout);
        this.stream = await this.streamingService.startStream(TypeCamera.FRONT);
        this.startVideo(this.stream, false);
        this.myVideo.nativeElement.play();  
        this.myVideo.nativeElement.controls = false;
      }
      this.status = StatusStream.INITIAL;
    } catch (error) {
      console.log(error);
      this.error.emit(error);
    }
  }

  async clickUpload(): Promise<void> {
    try {
        this.upload.emit(this.blob);
        console.log('upload');
    } catch(error) {
      console.log(error);
      this.error.emit(error);
    }
  }

  async clickCapture(): Promise<void> {
    try {
      await this.streamingService.startCapture(this.timeout);
      this.status = StatusStream.PROGRESS;
    } catch(error) {
      console.log(error);
      this.error.emit(error);
    }
  }

  clickPreview(): void {
    this.myVideo.nativeElement.play();
    this.myVideo.nativeElement.controls = true;
    this.controls = false;
  }

  async clickStop(): Promise<void> {
    try {
     this.blob = await this.streamingService.stopCapture();
     this.startVideo(window.URL.createObjectURL(this.blob), true);
     this.streamingService.stopStreamedVideo(this.myVideo.nativeElement);
     this.stream = null;
     this.status = StatusStream.FINISHED;
    } catch (error) {
      console.log(error);
      this.error.emit(error);
    }
  }

  private startVideo(source: string|MediaStream|Blob, controls: boolean): void {
    const video: HTMLVideoElement = this.myVideo.nativeElement;
    if ('srcObject' in video && (source instanceof MediaStream || source instanceof Blob)) {
      video.srcObject = source;
      video.src = null;
    }else {
      video.srcObject = null;
      video.src = source as string;
    }
  }

 

}
