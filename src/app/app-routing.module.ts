import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UploadComponent } from './upload/upload.component';
import { FileListComponent } from './file-list/file-list.component';
import { ShareFileComponent } from './share-file/share-file.component';
import { DownloadComponent } from './download/download.component';
import { FileViewComponent } from './file-view/file-view.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: 'login', component: LoginComponent },
  // { path: 'upload', component: UploadComponent },
  { path: 'files', component: FileListComponent },
  // { path: 'share', component: ShareFileComponent },
  // { path: 'download/:a/:b', component:DownloadComponent},
  { path: 'file/:id', component: FileViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    enableTracing:false,
    useHash:true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
