import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
} from "@angular/core";
import { Router } from "@angular/router";
import { Subject, Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Luwfy } from "@luwfy/luwfy-frontime";
import { blocksLuwfy } from "./dynamicLoader";
import { HttpClient } from "@angular/common/http";
import { PlaceholderComponent } from "@luwfy/default-component-angular-luwfy";
import { LuwfyFlowUiCanvasLibraryComponent } from "luwfy-flow-ui-canvas-library";

@Injectable({
  providedIn: "root",
})
export class LuwfyService {
  luwfy: any;
  myWebSocket: any;
  blocks: any;
  getFlowCheck = new Subject<any>();
  flows = [];
  elements = [];
  public components = {
    placeholderComponent: PlaceholderComponent,
    //@ts-ignore
    gojsComponent: LuwfyFlowUiCanvasLibraryComponent,
  };
  private pages_data = {};
  private page_data = new Subject<any>();
  public page_data_listener = this.page_data.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
    var that = this;
    this.appendStyle();
    this.appendScript("./assets/luwfyScripts/material.min.js", function () {
      fetch("./assets/orderFlows.json")
        .then((value: Response) => {
          return value.json();
        })
        .then((flowsFiles: any[]) => {
          that.setFlows(flowsFiles);
        });
    });
  }

  setFlows(flowsFiles) {
    let i = 0;
    for (let file of flowsFiles) {
      fetch("./assets/flows/" + file)
        .then((value: Response) => {
          return value.json();
        })
        .then((newFlows: any[]) => {
          this.flows = this.flows.concat(newFlows);
          i++;
          if (i == flowsFiles.length) {
            for (let block of this.flows) {
              if (block.type == "template") {
                //this.getAllTheTagsTemplate(block.template);
              }
            }
            this.setRuntime();
          }
        });
    }
  }

  setRuntime() {
    this.luwfy = new Luwfy({
      development: true,
      settings: {},
      componentFactoryResolver: this.componentFactoryResolver,
      appRef: this.appRef,
      injector: this.injector,
      components: this.components,
      router: this.router,
      http: this.http,
      that: this,
      flows: this.flows,
      blocks: blocksLuwfy,
    });
    var that = this;

    this.appendScript("./assets/luwfyScripts/lw.elements.js", function () {
      let url = that.router.url.substring(1, that.router.url.length);
      that.router.config.shift();
      that.router
        .navigateByUrl("/", { skipLocationChange: true })
        .then(() => that.router.navigate([url]));
    });
  }
  getAllTheTagsTemplate(template: any) {
    let parser = new DOMParser();
    let htmlDoc = parser.parseFromString(template, "text/html");
    let temp = htmlDoc.body.getElementsByTagName("*");
    //@ts-ignore
    for (let tem of temp) {
      if (
        this.elements.includes(tem.localName) == false &&
        tem.localName.includes("lw-")
      ) {
        this.elements.push(tem.localName);
        this.appendScriptAndStyle(tem.localName, function () {});
      }
    }
  }
  appendScriptAndStyle(src, cb) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    document.getElementsByTagName("head")[0].appendChild(script);
    if (cb) {
      script.onload = cb;
    }
    script.setAttribute("src", "./assets/luwfyScripts/" + src + ".js");
    var link = document.createElement("link");
    link.href = "./assets/luwfyStyles/" + src + ".css";
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
  }

  appendScript(src, cb) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    document.getElementsByTagName("head")[0].appendChild(script);
    if (cb) {
      script.onload = cb;
    }
    // if (src != "element") {
    // script.setAttribute("src", this.base + src + ".js");
    // } else {
    script.setAttribute("src", src);
    // }
  }
  appendStyle() {
    var link = document.createElement("link");
    link.href = "./assets/luwfyStyles/lw-variable.css";
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
    var link2 = document.createElement("link");
    link2.href = "./assets/luwfyStyles/lw.default.all.css";
    link2.type = "text/css";
    link2.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link2);
  }
}
