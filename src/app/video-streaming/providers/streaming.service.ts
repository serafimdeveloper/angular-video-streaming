import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StreamingService {

  private stream: MediaStream;
  private mediaRecord: MediaRecorder;
  private chunks: Blob[] = [];
  private timeout;
  private timeVideo: Subject<string> = new Subject();
  private eventTimeOut: EventEmitter<void> = new EventEmitter();

  get timeVideoObservable$(): Observable<string> {
    return this.timeVideo.asObservable();
  }

  get listenTimeOut$(): Observable<void> {
    return this.eventTimeOut.asObservable();
  }

  public async getDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch (error) {
      throw error;
    }
  }

  public async startStream(typeCamera: string): Promise<MediaStream> {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: {
            min: 640,
            ideal: 1280,
            max: 1920,
          },
          height: {
            min: 360,
            ideal: 720,
            max: 1080,
          },
          facingMode: typeCamera
        }, audio: true
      };
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.stream;
    } catch (error) {
      throw error;
    }
  }

  public async startCapture(timeout: number): Promise<void> {
    try {
      this.mediaRecord = new MediaRecorder(this.stream);
      this.mediaRecord.ondataavailable = (ev: BlobEvent) => {
        this.chunks.push(ev.data);
      };
      this.mediaRecord.start();
      await this.startCountdown(timeout);
    } catch (error) {
      throw error;
    }
  }

  public async stopCapture(): Promise<Blob> {
    try {
      clearTimeout(this.timeout);
      this.timeVideo.next(null);
      return await this.onStop();
    } catch (error) {
      throw error;
    }
  }

  public convertTime(tempo: number) {
    const min = ('0' + Math.floor(tempo / 60)).substr(-2);
    const seg = ('0' + Math.floor(tempo % 60)).substr(-2);
    return `${min}:${seg}`;
  }

  public async startCountdown(tempo: number): Promise<void> {
    if (tempo - 1 >= 0) {
      this.timeVideo.next(this.convertTime(tempo));
      tempo--;
      this.timeout = setTimeout(async () => await this.startCountdown(tempo), 1000);
    } else {
      this.eventTimeOut.emit();
    }
  }

  public async stopStreamedVideo(videoElem: HTMLVideoElement) {
    const streak = this.stream.getVideoTracks();
    streak.forEach((s: MediaStreamTrack) => {
      s.stop();
      this.stream.removeTrack(s);
    });
    videoElem.srcObject = null;
  }

  private onStop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.mediaRecord.onstop = (ev: Event) => {
        const blob = new Blob(this.chunks, { type: 'video/mp4'});
        this.chunks = [];
        if (blob) {
          resolve(blob);
        } else {
          reject({error: 'Ocorreu um ao pausar o stream'});
        }
      };
      this.mediaRecord.stop();
    });
  }
}
