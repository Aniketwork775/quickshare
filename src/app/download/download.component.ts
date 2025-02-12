import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent {
  id:any;
  name:any;
  constructor(private route:ActivatedRoute){
    this.route.params.forEach((urlParams) => {
      this.id=urlParams["a"];
      this.name=urlParams["b"];
    })
    const url =atob(this.id);
    const name =atob(this.name)
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
