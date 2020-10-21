import { Component } from '@angular/core';
import { ConfigText } from './video-streaming/models/configText';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-teste';

  configText: ConfigText = {
    record: '<i class="fa fa-video-camera"></i> gravar',
    rewrite: '<i class="fa fa-refresh"></i> regravar',
    stop: '<i class="fa fa-stop"></i> stop',
    upload: '<i class="fa fa-upload"></i> upload',
    preview: '<i class="fa fa-eye"></i> rever',
    messageSuccess: 'Seu vídeo foi gravado com sucesso!'
  };

  upload(blob: Blob) {
    console.log(blob);
    alert('upload concluido');
    const file = new File([blob], 'video', {lastModified: (new Date).getTime(), type: blob.type});
    console.log(file);
    window.open(window.URL.createObjectURL(blob));
  }

  error(e) {
    console.log(e);
  }
}
