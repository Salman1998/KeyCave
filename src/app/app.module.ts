import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment.development';
import { HomeComponent } from './default/home/home.component';
import { NavComponent } from './default/nav/nav.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { UnauthorizedComponent } from './shared/unauthorized/unauthorized.component';
import { WebsiteComponent } from './website/website.component';
import { NotePopupComponent } from './shared/notepopup/notepopup.component';
import { CopyToClipComponent } from './shared/copy-to-clipboard/copy-to-clipboard.component';
import { ShortString } from './shared/shortstring.pipe';
import { HidepassPipe } from './shared/hidepass.pipe';
import { UrlShortString } from './shared/urlshortstring.pipe';
import { HoverTextComponent } from './shared/hover-text/hover-text.component';
import { FilterDataWebsitePipe } from './shared/filter.data.website';
import { FooterComponent } from './default/footer/footer.component';
import { FilterDataWebsiteUserPipe } from './shared/filter.data.websiteuser';
import { ExportExcelComponent } from './export-file/export-excel/export-excel.component';
import { ExportJsonComponent } from './export-file/export-json/export-json.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageFilterPipe } from './shared/filter.data.pagefilter';
import { FilterDataModifierPipe } from './shared/filter.data.modifier';
import { FilterDataPipe } from './shared/filter.data.pipe';
import { AdminComponent } from './admin/admin.component';
import { RecycleBinComponent } from './recycle-bin/recycle-bin.component';



@NgModule({
  declarations: [

    // Pipe 
    ShortString,
    HidepassPipe,
    UrlShortString,
    HoverTextComponent,
    FilterDataWebsitePipe,
    FilterDataWebsiteUserPipe,
    PageFilterPipe,
    FilterDataModifierPipe,
    FilterDataPipe,

    // Components
    AppComponent,
    HomeComponent,
    NavComponent,
    LoginComponent,
    SignupComponent,
    SpinnerComponent,
    ForgotPasswordComponent,
    UnauthorizedComponent,
    WebsiteComponent,
    NotePopupComponent,
    CopyToClipComponent,
    FooterComponent,
    ExportExcelComponent,
    ExportJsonComponent,
    AdminPanelComponent,
    DashboardComponent,
    AdminComponent,
    RecycleBinComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpClientModule
  ],
  providers: [
    // provideFirebaseApp(() => initializeApp({
    //   apiKey: "AIzaSyB8cuyOlwNjBEqfP2ptgpyp851y1Xj0Fa8",
    //   authDomain: "key-cave.firebaseapp.com",
    //   projectId: "key-cave",
    //   storageBucket: "key-cave.firebasestorage.app",
    //   messagingSenderId: "234201580921",
    //   appId: "1:234201580921:web:2a94f63b7a74fdef3f5ba8",
    //   measurementId: "G-GJLGGHVYHZ"
    //   })),
    // provideAuth(() => getAuth()),
    // provideDatabase(() => getDatabase()),
    // provideFirebaseApp(() => initializeApp({
    //   apiKey: "AIzaSyB8cuyOlwNjBEqfP2ptgpyp851y1Xj0Fa8",
    //   authDomain: "key-cave.firebaseapp.com",
    //   projectId: "key-cave",
    //   storageBucket: "key-cave.firebasestorage.app",
    //   messagingSenderId: "234201580921",
    //   appId: "1:234201580921:web:2a94f63b7a74fdef3f5ba8",
    //   measurementId: "G-GJLGGHVYHZ"
    //   }))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
