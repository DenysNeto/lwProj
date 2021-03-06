import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { LuwfyFlowUiCanvasLibraryModule } from "luwfy-flow-ui-canvas-library";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { GoJSComponentProject } from "./luwfy-component/luwfy-component.component";

@NgModule({
  declarations: [AppComponent, GoJSComponentProject],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LuwfyFlowUiCanvasLibraryModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
