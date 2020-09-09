import { Component, ViewChild } from "@angular/core";
import { LuwfyService } from "./luwfy.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "flowTest";
  constructor(private service: LuwfyService) { }
}
