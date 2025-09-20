import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AiToolsComponent } from './pages/ai-tools/ai-tools.component';
import { AiChatbotComponent } from './components/ai-chatbot/ai-chatbot.component';
import { AiContentGeneratorComponent } from './components/ai-content-generator/ai-content-generator.component';

// Firebase imports
import { FirebaseService } from './services/firebase.service';
import { AiService } from './services/ai.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    ProjectsComponent,
    ContactComponent,
    AiToolsComponent,
    AiChatbotComponent,
    AiContentGeneratorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [FirebaseService, AiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
