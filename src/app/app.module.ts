import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UploadComponent } from './upload/upload.component';
import { FileListComponent } from './file-list/file-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './common/material/material.module';
import { ShareFileComponent } from './share-file/share-file.component';
// import { MaterialModule } from './common/material/material.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { DownloadComponent } from './download/download.component';
import { FileViewComponent } from './file-view/file-view.component';
import { HttpClientModule } from '@angular/common/http';
import { ThreeDBackgroundComponent } from './three-dbackground/three-dbackground.component';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    UploadComponent,
    FileListComponent,
    ShareFileComponent,
    DownloadComponent,
    FileViewComponent,
    ThreeDBackgroundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFirestoreModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      timeOut: 2000, // Auto close after 3 sec
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
