import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as go from "gojs";

export enum GoJsBlockIconsType {
  SettingsIcon = "settingsIcon",
  InformationIcon = "informationIcon",
  CommentIcon = "commentIcon",
  DeleteIcon = "deleteIcon",
  DebugeIcon = "debugIcon",
}

export enum GoJsBlockIconsValue {
  SettingsIcon = "e928",
  InformationIcon = "e926",
  CommentIcon = "e923",
  DeleteIcon = "e925",
  DebugeIcon = "e924",
}

@Component({
  selector: "./luwfy-component.component.html",
  templateUrl: "./luwfy-component.component.html",
  styles: [],
})
export class GoJSComponentProject implements OnInit {
  private $;
  myDiagram;
  @Input() model = {
    class: "go.GraphLinksModel",
    nodeCategoryProperty: "type",
    linkFromPortIdProperty: "outPortId",
    linkToPortIdProperty: "inPortId",
    linkDataArray: [],
    nodeDataArray: [],
  };
  @Output() eventsOut = new EventEmitter<any>();
  @Input() props;
  @Input() paletteArr;

  constructor() {
    this.$ = go.GraphObject.make;
  }

  ngOnInit(): void {}

  highlight(node) {
    // may be null
    // var oldskips = myDiagram.skipsUndoManager;
    this.myDiagram.skipsUndoManager = true;
    this.myDiagram.startTransaction("highlight");
    if (node !== null) {
      this.myDiagram.highlight(node);
    } else {
      this.myDiagram.clearHighlighteds();
    }
    this.myDiagram.commitTransaction("highlight");
    // myDiagram.skipsUndoManager = oldskips;
  }

  currentPaletteId;
  obj;
  inputPort = [];
  outputPort = [];

  dragAndDropSetters() {
    var dragged = null; // A reference to the element currently being dragged

    // highlight stationary nodes during an external drag-and-drop into a Diagram
    //TODO dragend
    document.addEventListener(
      "dragstart",
      (event) => {
        this.currentPaletteId = event.target["id"];
        if (event.target["className"] !== "draggable") return;
        // Some data must be set to allow drag
        event.dataTransfer.setData("text", event.target["textContent"]);
        // store a reference to the dragged element and the offset of the mouse from the center of the element
        dragged = event.target;
        dragged.offsetX = event.offsetX - dragged.clientWidth / 2;
        dragged.offsetY = event.offsetY - dragged.clientHeight / 2;
        // Objects during drag will have a red border
        event.target["style"].border = "2px solid red";
      },
      false
    );

    // This event resets styles after a drag has completed (successfully or not)
    //TODO dragstart
    document.addEventListener(
      "dragend",
      (event) => {
        // reset the border of the dragged element
        dragged.style.border = "";
        console.log("DRAG_END");
        this.highlight(null);
      },
      false
    );

    var div = document.getElementById("myDiagramDiv");

    div.addEventListener(
      "dragenter",
      function (event) {
        console.log("DRAG_ENTER");
        // Here you could also set effects on the Diagram,
        // such as changing the background color to indicate an acceptable drop zone

        // Requirement in some browsers, such as Internet Explorer
        event.preventDefault();
      },
      false
    );

    div.addEventListener(
      "dragover",
      (event) => {
        // We call preventDefault to allow a drop
        // But on divs that already contain an element,
        // we want to disallow dropping

        console.log("dragover", event);

        if (true || this === this.myDiagram.div) {
          var can = event.target;
          var pixelratio = window["PIXELRATIO"];

          // if the target is not the canvas, we may have trouble, so just quit:
          if (!(can instanceof HTMLCanvasElement)) return;

          var bbox = can.getBoundingClientRect();
          var bbw = bbox.width;
          if (bbw === 0) bbw = 0.001;
          var bbh = bbox.height;
          if (bbh === 0) bbh = 0.001;
          var mx = event.clientX - bbox.left * (can.width / pixelratio / bbw);
          var my = event.clientY - bbox.top * (can.height / pixelratio / bbh);
          var point = this.myDiagram.transformViewToDoc(new go.Point(mx, my));
          var curnode = this.myDiagram.findPartAt(point, true);
          if (curnode instanceof go.Node) {
            this.highlight(curnode);
          } else {
            this.highlight(null);
          }
        }

        if (event.target["className"] === "dropzone") {
          // Disallow a drop by returning before a call to preventDefault:
          return;
        }

        // Allow a drop on everything else
        event.preventDefault();
      },
      false
    );

    div.addEventListener(
      "dragleave",
      (event) => {
        // reset background of potential drop target
        if (event.target["className"] == "dropzone") {
          event.target["style"].background = "";
        }
        this.highlight(null);
      },
      false
    );

    var remove = document.getElementById("remove");

    div.addEventListener(
      "drop",
      (event) => {
        // prevent default action
        // (open as link for some elements in some browsers)
        event.preventDefault();

        let palette = this.getPaletteById(
          this.paletteArr,
          this.currentPaletteId
        );

        // Dragging onto a Diagram
        if (true || this === this.myDiagram.div) {
          var can = event.target;
          var pixelratio = window["PIXELRATIO"];

          // if the target is not the canvas, we may have trouble, so just quit:
          if (!(can instanceof HTMLCanvasElement)) return;

          var bbox = can.getBoundingClientRect();
          var bbw = bbox.width;
          if (bbw === 0) bbw = 0.001;
          var bbh = bbox.height;
          if (bbh === 0) bbh = 0.001;
          var mx =
            event.clientX -
            bbox.left * (can.width / pixelratio / bbw) -
            dragged.offsetX;
          var my =
            event.clientY -
            bbox.top * (can.height / pixelratio / bbh) -
            dragged.offsetY;
          var point = this.myDiagram.transformViewToDoc(new go.Point(mx, my));

          // remove dragged element from its old location
          // if (remove['checked']) dragged.parentNode.removeChild(dragged);
        }
        this.outputPort = [];
        for (
          let i = 0;
          i < palette.outputs + +palette.outputSuccess + +palette.outputError;
          i++
        ) {
          this.outputPort.push(this.makePort(i + 1, false, palette.color));
        }
        this.inputPort = palette.input
          ? this.makePort("INPUT", true, palette.color)
          : [];

        (this.testNode = this.makeTemplate(
          palette.luwfyBlockCategoyName,
          palette.name,
          null,
          palette.color,
          [this.makePort("INPUT", true, palette.color)],
          [...this.outputPort],
          palette.outputs,
          palette.condition,
          "e905"
        )),
          this.myDiagram.startTransaction("new node");

        this.obj = {
          outputs: palette.outputs,
          outputSuccess: palette.outputSuccess,
          outputError: palette.outputError,
          faceImage: palette.luwfyImageId,
          input: palette.input,
          color: palette.color,
          color2: "red",
          type: palette.luwfyBlockCategoyName,
          formSettings: palette.luwfyBlockSetting,
          formWizzard: palette.luwfyBlockWizard,
          name: palette.name,
          key: new Date().getTime(),
        };

        this.myDiagram.model.addNodeData({
          ...this.obj,
        });

        this.myDiagram.commitTransaction("new node");
        window["PIXELRATIO"] = this.myDiagram.computePixelRatio();
      },
      false
    );
  }

  testNode;

  updateBlock(palette) {
    this.outputPort = [];
    for (
      let i = 0;
      i < palette.outputs + +palette.outputSuccess + +palette.outputError;
      i++
    ) {
      this.outputPort.push(this.makePort(i + 1, false, palette.color));
    }

    this.makeTemplate(
      palette.name,
      palette.name,
      null,
      palette.color,
      [this.makePort("INPUT", true, palette.color)],
      [...this.outputPort],
      palette.outputs,
      palette.condition,
      "e905"
    );

    this.myDiagram.startTransaction("new node");

    this.obj = {
      outputs: palette.outputs,
      outputSuccess: palette.outputSuccess,
      outputError: palette.outputError,
      faceImage: palette.luwfyImageId,
      input: palette.input,
      color: palette.color,
      color2: "red",
      type: palette.type,
      formSettings: palette.luwfyBlockSetting,
      formWizzard: palette.luwfyBlockWizard,
      name: palette.name,
      key: new Date().getTime(),
    };

    this.myDiagram.model.addNodeData({
      ...this.obj,
    });

    this.myDiagram.commitTransaction("new node");
  }

  makeIndicator(propName) {
    // the data property name
    console.log("propName", propName);
    return this.$(
      go.Shape,
      "Circle",
      { width: 8, height: 8, fill: "white", strokeWidth: 0, margin: 5 },
      new go.Binding("fill", propName)
    );
  }

  buildOutputPorts(outputs, outputSuccess, outputError, color) {
    console.log("VALUESZZZZ", outputs, outputSuccess, outputError, color);
    let outputPort = [];

    // outputPort.push(this.makePort(1, false, color));
    // outputPort.push(this.makePort(2, false, color));
    for (let i = 0; i < outputs + +outputSuccess + +outputError; i++) {
      outputPort.push(
        this.$(
          go.Shape,
          "Circle",
          { width: 8, height: 8, fill: "white", strokeWidth: 0, margin: 5 },
          new go.Binding("fill", color)
        )
      );
    }

    // console.log("outputPort", outputPort);
    return outputPort;
  }

  getPaletteById(palettesArr, id) {
    let res;
    palettesArr.forEach((palette) => {
      if (palette.id === id) {
        res = palette;
      }
    });
    return res;
  }

  parseGoJsToLuwfy() {
    let inputDataArr = [
      ...JSON.parse(this.myDiagram.model.toJson()).nodeDataArray,
    ];
    let linktDataArr = [
      ...JSON.parse(this.myDiagram.model.toJson()).linkDataArray,
    ];
    let flowArr = [];
    inputDataArr.forEach((modelElem) => {
      let wiresArr = [];
      for (
        let i = 0;
        i <
        modelElem.outputs + +modelElem.outputSuccess + +modelElem.outputError;
        i++
      ) {
        wiresArr.push([]);
      }
      let filteredLinkArr = linktDataArr.filter(
        (link) => link.from == modelElem.key
      );
      filteredLinkArr.forEach((linkElem) => {
        wiresArr[linkElem.outPortId - 1].push(linkElem.to);
      });

      let block = {
        id: modelElem.key,
        outputs: modelElem.outputs,
        outputSuccess: modelElem.outputSuccess,
        outputError: modelElem.outputError,
        z: modelElem.z,
        type: modelElem.type,
        wires: wiresArr,
      };

      flowArr.push(block);

      console.log("PARSER_UPDATE", flowArr);
    });

    return flowArr;
  }

  updateCanvas(payload) {
    this.myDiagram.model.addNodeData({
      outputs: 1,
      outputSuccess: false,
      outputError: false,
      faceImage: "2d7dc200-a06f-4af1-b559-f3bc9c163a7b",
      input: true,
      color: "#FFC300 ",
      color2: "red",
      type: "network",
      formSettings: "59d69780-65c8-4ba3-ba3a-f91c25e4f96d",
      formWizzard: null,
      name: "http request",
      key: -1,
      loc: "0 80",
    });

    // this.myDiagram.model.nodeDataArray.push({
    //   outputs: 1,
    //   outputSuccess: false,
    //   outputError: false,
    //   faceImage: "2d7dc200-a06f-4af1-b559-f3bc9c163a7b",
    //   input: true,
    //   color: "#FFC300 ",
    //   color2: "red",
    //   type: "network",
    //   formSettings: "59d69780-65c8-4ba3-ba3a-f91c25e4f96d",
    //   formWizzard: null,
    //   name: "http request",
    //   key: -1,
    //   loc: "0 80",
    // });

    // if (payload) {
    //   this.myDiagram.model.nodeDataArray.push(payload);
    // }
  }

  parserLuwfyToGoJs() {
    let inputDataArr = [
      {
        id: "b9f855d8.bb2a28",
        wires: [["80855b14.ba5ce8"]],
        outputs: 1,
        type: "view in",
        x: 88,
        y: 496,
        z: "6f9eef4f.2aa0e",
        outputSuccess: false,
        outputError: false,
        url: "/flowdenys",
      },
      {
        id: "80855b14.ba5ce8",
        wires: [["43e682ff.77ceac", "d1a95953.74aa78"]],
        outputs: 1,
        type: "template",
        x: 281,
        y: 534,
        z: "6f9eef4f.2aa0e",
        outputSuccess: false,
        outputError: false,
        addToPrint: "false",
        field: "data",
        format: "handlebars",
        output: "json",
        template:
          '{\n    "class": "go.GraphLinksModel",\n    "nodeCategoryProperty": "type",\n    "linkFromPortIdProperty": "outPortId",\n    "linkToPortIdProperty": "inPortId",\n    "linkDataArray": [{ "from": -1, "to": -6, "outPortId": 1, "inPortId": "INPUT" },{ "from": -6, "to": -5, "outPortId": 2, "inPortId": "INPUT" },{ "from": -7, "to": -8, "outPortId": 2, "inPortId": "INPUT" },\n      { "from": -7, "to": -9, "outPortId": 3, "inPortId": "INPUT" },\n      { "from": -10, "to": -7, "outPortId": 1, "inPortId": "INPUT" },\n    ],\n    nodeDataArray: [\n      { "outputs": 1, "outputSuccess": false, "outputError": false, "faceImage": "2d7dc200-a06f-4af1-b559-f3bc9c163a7b", "input": true, "color": "#FFC300 ", "color2": "red", "type": "network", "formSettings": "59d69780-65c8-4ba3-ba3a-f91c25e4f96d", "formWizzard": null, "name": "http request", "key": -1, "loc": "0 80" },\n      { "outputs": 0, "outputSuccess": false, "outputError": false, "faceImage": null, "input": true, "color": "#273f8a", "color2": "red", "type": "common", "formSettings": "4554b140-b389-4c85-b3b8-68f00005b332", "formWizzard": null, "name": "debug", "key": -3, "loc": "252 560" },\n      { "outputs": 0, "outputSuccess": false, "outputError": false, "faceImage": null, "input": true, "color": "#273f8a", "color2": "red", "type": "common", "formSettings": "4554b140-b389-4c85-b3b8-68f00005b332", "formWizzard": null, "name": "debug", "key": -4, "loc": "252 140" },\n      { "outputs": 0, "outputSuccess": false, "outputError": false, "faceImage": null, "input": true, "color": "#273f8a", "color2": "red", "type": "common", "formSettings": "4554b140-b389-4c85-b3b8-68f00005b332", "formWizzard": null, "name": "debug", "key": -5, "loc": "252 0" },\n      { "outputs": 3, "outputSuccess": false, "outputError": false, "faceImage": null, "input": false, "color": "#93f916", "color2": "red", "type": "RxJS", "formSettings": "eaf74626-5f8a-4867-bfc2-f0e691abf3cd", "formWizzard": null, "name": "rx subscriber", "key": -6, "loc": "126 66.5" },\n      { "outputs": 3, "outputSuccess": false, "outputError": false, "faceImage": null, "input": false, "color": "#93f916", "color2": "red", "type": "RxJS", "formSettings": "eaf74626-5f8a-4867-bfc2-f0e691abf3cd", "formWizzard": null, "name": "rx subscriber", "key": -7, "loc": "126 346.5" },\n      { "outputs": 0, "outputSuccess": false, "outputError": false, "faceImage": null, "input": true, "color": "#273f8a", "color2": "red", "type": "common", "formSettings": "4554b140-b389-4c85-b3b8-68f00005b332", "formWizzard": null, "name": "debug", "key": -8, "loc": "252 280" },\n      { "outputs": 0, "outputSuccess": false, "outputError": false, "faceImage": null, "input": true, "color": "#273f8a", "color2": "red", "type": "common", "formSettings": "4554b140-b389-4c85-b3b8-68f00005b332", "formWizzard": null, "name": "debug", "key": -9, "loc": "252 420" },\n      { "outputs": 1, "outputSuccess": false, "outputError": false, "faceImage": "2d7dc200-a06f-4af1-b559-f3bc9c163a7b", "input": true, "color": "#FFC300 ", "color2": "red", "type": "network", "formSettings": "59d69780-65c8-4ba3-ba3a-f91c25e4f96d", "formWizzard": null, "name": "http request", "key": -10, "loc": "0 3360" },\n    ]\n  }',
        fieldType: "msg",
        condition: {
          switch: 0,
        },
      },
      {
        id: "dc89d56c.4f4ff8",
        wires: [["1f790ad6.0744f5", "21715b0f.fd5794"]],
        outputs: 1,
        type: "function",
        x: 393,
        y: 42,
        z: "6f9eef4f.2aa0e",
        outputSuccess: false,
        outputError: false,
        func: "format go js ",
        condition: {
          switch: 1,
        },
      },

      {
        id: "6f9eef4f.2aa0e",
        type: "flowboard",
        label: "Flowboard 1",
        disabled: false,
        location: {
          x: 111.97368421052632,
          y: 40,
        },
        width: 400,
        height: 400,
      },
    ];

    let linkDataArrayTemp = [];
    let nodeDataArrayTemp = [];

    inputDataArr.forEach((inputElem) => {
      if (inputElem.type != "flowboard") {
        let objDataArray = {
          outputs: inputElem.outputs,
          outputSuccess: inputElem.outputSuccess,
          outputError: inputElem.outputError,
          // input:
          // color:
          type: inputElem.type,
          name: inputElem["name"] || inputElem.type,
          key: inputElem.id,
          z: inputElem.z,
          condition: inputElem.condition,
          // loc:
        };
        nodeDataArrayTemp.push(objDataArray);
      } else {
        let objDataFlowboard = {
          key: inputElem.id,
          type: inputElem.type,
          label: inputElem.label,
          disabled: inputElem.disabled,
        };
        nodeDataArrayTemp.push(objDataFlowboard);
        //TODO add flowboard to nodeDataArray
      }

      if (inputElem.wires) {
        inputElem.wires.forEach((wirePortArr, index) => {
          wirePortArr.forEach((wirePortItem) => {
            let objLinkDataArr = {
              from: inputElem.id,
              to: wirePortItem,
              outPortId: index + 1,
              inPortId: "INPUT",
            };

            linkDataArrayTemp.push(objLinkDataArr);
          });
        });
      }
    });

    let payload = {
      class: "go.GraphLinksModel",
      nodeCategoryProperty: "type",
      linkFromPortIdProperty: "outPortId",
      linkToPortIdProperty: "inPortId",
      linkDataArray: [...linkDataArrayTemp],
      nodeDataArray: [...nodeDataArrayTemp],
    };

    console.log("PAYTLOAD!!!!", payload);
    return payload;
  }

  isUnoccupied(r, node) {
    var diagram = node.diagram;

    // nested function used by Layer.findObjectsIn, below
    // only consider Parts, and ignore the given Node, any Links, and Group members
    let navig = (obj) => {
      var part = obj.part;
      if (part === node) return null;
      if (part instanceof go.Link) return null;
      if (part.isMemberOf(node)) return null;
      if (node.isMemberOf(part)) return null;
      return part;
    };

    // only consider non-temporary Layers
    var lit = diagram.layers;
    while (lit.next()) {
      var lay = lit.value;
      if (lay.isTemporary) continue;
      if (lay.findObjectsIn(r, navig, null, true).count > 0) return false;
    }
    return true;
  }

  avoidNodeOverlap(node, pt, gridpt) {
    let isUnoccupied = (r, node) => {
      var diagram = node.diagram;

      // nested function used by Layer.findObjectsIn, below
      // only consider Parts, and ignore the given Node, any Links, and Group members
      let navig = (obj) => {
        var part = obj.part;
        if (part === node) return null;
        if (part instanceof go.Link) return null;
        if (part.isMemberOf(node)) return null;
        if (node.isMemberOf(part)) return null;
        return part;
      };

      // only consider non-temporary Layers
      var lit = diagram.layers;
      while (lit.next()) {
        var lay = lit.value;
        if (lay.isTemporary) continue;
        if (lay.findObjectsIn(r, navig, null, true).count > 0) return false;
      }
      return true;
    };

    if (node.diagram instanceof go.Palette) return gridpt;
    // this assumes each node is fully rectangular
    var bnds = node.actualBounds;
    var loc = node.location;
    // use PT instead of GRIDPT if you want to ignore any grid snapping behavior
    // see if the area at the proposed location is unoccupied
    var r = new go.Rect(
      gridpt.x - (loc.x - bnds.x),
      gridpt.y - (loc.y - bnds.y),
      bnds.width,
      bnds.height
    );
    // maybe inflate R if you want some space between the node and any other nodes
    r.inflate(-0.5, -0.5); // by default, deflate to avoid edge overlaps with "exact" fits
    // when dragging a node from another Diagram, choose an unoccupied area
    if (
      !(node.diagram.currentTool instanceof go.DraggingTool) &&
      (!node._temp || !node.layer.isTemporary)
    ) {
      // in Temporary Layer during external drag-and-drop
      node._temp = true; // flag to avoid repeated searches during external drag-and-drop
      while (isUnoccupied(r, node)) {
        r.x += 10; // note that this is an unimaginative search algorithm --
        r.y += 2; // you can improve the search here to be more appropriate for your app
      }
      r.inflate(0.5, 0.5); // restore to actual size
      // return the proposed new location point
      return new go.Point(r.x - (loc.x - bnds.x), r.y - (loc.y - bnds.y));
    }
    if (isUnoccupied(r, node)) return gridpt; // OK
    return loc; // give up -- don't allow the node to be moved to the new location
  }

  init() {
    console.log("OOOO", this.$, this.myDiagram);

    this.myDiagram = this.$(go.Diagram, "myDiagramDiv", {
      "grid.visible": false,
      ModelChanged: (e) => this.saveModel(e),
      // panningTool: false,
      hasVerticalScrollbar: true,
      hasHorizontalScrollbar: true,
      allowHorizontalScroll: true,
      allowVerticalScroll: true,
      padding: 50,
      initialContentAlignment: go.Spot.TopLeft,
      initialAutoScale: go.Diagram.UniformToFill,
      isModelReadOnly: false,

      // //TODO disable/enable layout
      layout: this.$(go.LayeredDigraphLayout, {
        direction: 0,
        layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource,
        // TODO  GET and  SET grid column/layer spacing
        layerSpacing: 10,
        columnSpacing: 10,
      }),

      "undoManager.isEnabled": true,
    });

    this.myDiagram.toolManager.panningTool.isEnabled = false;

    this.myDiagram.toolManager.dragSelectingTool.box = this.$(
      go.Part,
      { layerName: "Tool", selectable: false },
      this.$(go.Shape, {
        name: "SHAPE",
        fill: "rgba(231,242,255,0.2)",
        stroke: "blue",
        strokeWidth: 0.75,
      })
    );
    //TODO diagram position
    // this.myDiagram.position = { x: 0, y: 0, s: true }

    // //TODO
    // this.myDiagram.add(
    //   this.$(go.Part, "Auto",
    //     { position: new go.Point(0, 0) },
    //     this.$(go.Shape, "RoundedRectangle", { fill: "lightgreen", parameter1: 10 }),
    //     this.$(go.TextBlock, "some text", { margin: 2, background: "yellow" })
    //   )),

    // SET GRID
    // this.myDiagram.grid =
    //   this.$(go.Panel, go.Panel.Grid,
    //     { gridCellSize: new go.Size(20, 20) },
    //     this.$(go.Shape, "LineH", { stroke: theme.gridLineColor }),
    //     this.$(go.Shape, "LineV", { stroke: theme.gridLineColor })
    //   );

    // when the document is modified, add a "*" to the title and enable the "Save" button

    this.myDiagram.linkTemplate = this.$(
      go.Link,
      {
        routing: go.Link.AvoidsNodes,
        corner: 10,
      },

      this.$(
        go.Shape,
        {
          strokeWidth: 2,
        },
        new go.Binding("stroke", "from", (sel) => {
          let modelItem = this.myDiagram.model.findNodeDataForKey(sel);
          console.log("modelItem", modelItem);
          if (modelItem) {
            return modelItem.color;
          }
        })
      )
    );

    //TODO uncomment
    // this.model = this.parserLuwfyToGoJs();

    // this.myDiagram.model.nodeDataArray = [
    //   { "outputs": 1, "outputSuccess": false, "outputError": false, "faceImage": "2d7dc200-a06f-4af1-b559-f3bc9c163a7b", "input": true, "color": "#FFC300 ", "color2": "red", "type": "network", "formSettings": "59d69780-65c8-4ba3-ba3a-f91c25e4f96d", "formWizzard": null, "name": "http request", "key": -1, "loc": "0 80" },
    //   { "outputs": 0, "outputSuccess": false, "outputError": false, "faceImage": null, "input": true, "color": "#273f8a", "color2": "red", "type": "common", "formSettings": "4554b140-b389-4c85-b3b8-68f00005b332", "formWizzard": null, "name": "debug", "key": -3, "loc": "252 560" },
    //   { "outputs": 0, "outputSuccess": false, "outputError": false, "faceImage": null, "input": true, "color": "#273f8a", "color2": "red", "type": "common", "formSettings": "4554b140-b389-4c85-b3b8-68f00005b332", "formWizzard": null, "name": "debug", "key": -4, "loc": "252 140" },
    //   { "outputs": 0, "outputSuccess": false, "outputError": false, "faceImage": null, "input": true, "color": "#273f8a", "color2": "red", "type": "common", "formSettings": "4554b140-b389-4c85-b3b8-68f00005b332", "formWizzard": null, "name": "debug", "key": -5, "loc": "252 0" },
    //   { "outputs": 3, "outputSuccess": false, "outputError": false, "faceImage": null, "input": false, "color": "#93f916", "color2": "red", "type": "RxJS", "formSettings": "eaf74626-5f8a-4867-bfc2-f0e691abf3cd", "formWizzard": null, "name": "rx subscriber", "key": -6, "loc": "126 66.5" },
    //   { "outputs": 3, "outputSuccess": false, "outputError": false, "faceImage": null, "input": false, "color": "#93f916", "color2": "red", "type": "RxJS", "formSettings": "eaf74626-5f8a-4867-bfc2-f0e691abf3cd", "formWizzard": null, "name": "rx subscriber", "key": -7, "loc": "126 346.5" },
    //   { "outputs": 0, "outputSuccess": false, "outputError": false, "faceImage": null, "input": true, "color": "#273f8a", "color2": "red", "type": "common", "formSettings": "4554b140-b389-4c85-b3b8-68f00005b332", "formWizzard": null, "name": "debug", "key": -8, "loc": "252 280" },
    //   { "outputs": 0, "outputSuccess": false, "outputError": false, "faceImage": null, "input": true, "color": "#273f8a", "color2": "red", "type": "common", "formSettings": "4554b140-b389-4c85-b3b8-68f00005b332", "formWizzard": null, "name": "debug", "key": -9, "loc": "252 420" },
    //   { "outputs": 1, "outputSuccess": false, "outputError": false, "faceImage": "2d7dc200-a06f-4af1-b559-f3bc9c163a7b", "input": true, "color": "#FFC300 ", "color2": "red", "type": "network", "formSettings": "59d69780-65c8-4ba3-ba3a-f91c25e4f96d", "formWizzard": null, "name": "http request", "key": -10, "loc": "0 3360" },
    // ];

    this.load();

    this.dragAndDropSetters();

    // this.myDiagram.layout = false;

    // this.myDiagram.nodeTemplateMap.add("Comment",
    //   this.$(go.Node,  // this needs to act as a rectangular shape for BalloonLink,
    //     { background: "transparent" },  // which can be accomplished by setting the background.
    //     this.$(go.TextBlock,
    //       { stroke: "brown", margin: 3 },
    //       new go.Binding("text"))
    //   ));

    // this.myDiagram.linkTemplateMap.add("Comment",
    //   // if the BalloonLink class has been loaded from the Extensions directory, use it
    //   this.$((typeof BalloonLink === "function" ? BalloonLink : go.Link),
    //     this.$(go.Shape,  // the Shape.geometry will be computed to surround the comment node and
    //       // point all the way to the commented node
    //       { stroke: "brown", strokeWidth: 1, fill: "lightyellow" })
    //   ));
  }

  openGRapeJSView() {
    // var script = document.createElement('script');
    // script.setAttribute('type', 'text/javascript');
    // document.getElementsByTagName('head')[0].appendChild(script);

    let script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    document.getElementsByTagName("head")[0].appendChild(script);

    script.onload = function () {
      // Editor is ready
      let luwfy = window["luwfy"];

      // luwfy.registerComponent({
      //   'class': 'fa fa-save',
      //   'name': 'Smart QQQ',
      //   'component': 'smart-button',
      //   'category': 'Luwfy Form',
      //   'editorJS': false,
      //   'editorCSS': 'https://cdn.jsdelivr.net/gh/Luwfy/luwfy-grapesjs@master/assets/smart.default.css',
      //   // 'canvasJS': 'https://cdn.jsdelivr.net/gh/Luwfy/luwfy-grapesjs@master/assets/smart.default.css',
      //   'canvasCSS': 'https://cdn.jsdelivr.net/gh/Luwfy/luwfy-grapesjs@master/assets/smart.default.css',
      //   'rewriteTag': false,
      //   'inlineCSS': false,
      //   'keepClassNames': true,
      //   'traits': ['id', 'name', 'placeholder', 'label', 'text', 'value']
      // })

      luwfy.registerComponent({
        class: "fa fa-save",
        name: "Smart Button22",
        category: "Luwfy Form",
        component: "smart-button",
        editorJS: false,
        editorCSS: "../../assets/smart.default.css",
        canvasJS: "assets/smart/smart.button.js",
        canvasCSS: "../../assets/smart.default.css",
        rewriteTag: false,
        inlineCSS: false,
        keepClassNames: true,
        traits: [
          "id",
          "name",
          "placeholder",
          "label",
          "text",
          "value",
          {
            type: "href-next",
            name: "href",
            label: "New href",
          },
          {
            type: "text",
            name: "content",
            label: "Inner HTML",
            default: "Placeholder",
          },
        ],
      });

      luwfy.editorJS.push(
        "https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js"
      );

      luwfy.editorJS.push(
        "https://cdn.jsdelivr.net/gh/artf/grapesjs/dist/grapes.min.js"
      );

      luwfy.editorJS.push(
        "https://cdn.jsdelivr.net/gh/artf/grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.js"
      );

      luwfy.editorCSS.push(
        "https://cdn.jsdelivr.net/gh/artf/grapesjs/dist/css/grapes.min.css"
      );

      luwfy.editorCSS.push(
        "https://cdn.jsdelivr.net/gh/artf/grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.css"
      );

      luwfy.saveCallback = function (editor) {
        console.log("HTML:: " + editor.getHtml());
        console.log("CSS :: " + editor.getCss());
      };

      // Direct access to editor
      // luwfy.editor

      //@ts-ignore

      luwfy.loadEditor(function () {
        luwfy.startEditor(
          { content: "<smart-button>Hello World</smart-button>" },
          function (editor) {
            console.log("editor", editor);

            luwfy.editor.TraitManager.addType("href-next", {
              // Expects as return a simple HTML string or an HTML element
              createInput({ trait }) {
                // Here we can decide to use properties from the trait
                const traitOpts = trait.get("options") || [];
                const options = traitOpts.lenght
                  ? traitOpts
                  : [
                      { id: "url", name: "URL" },
                      { id: "email", name: "Email" },
                    ];

                // Create a new element container and add some content
                const el = document.createElement("div");
                el.innerHTML = `
                <select class="href-next__type">
                  ${options
                    .map(
                      (opt) => `<option value="${opt.id}">${opt.name}</option>`
                    )
                    .join("")}
                </select>
                <div class="href-next__url-inputs">
                  <input class="href-next__url" placeholder="Insert URL"/>
                </div>
                <div class="href-next__email-inputs">
                  <input class="href-next__email" placeholder="Insert email"/>
                  <input class="href-next__email-subject" placeholder="Insert subject"/>
                </div>
              `;

                // Let's make our content interactive
                const inputsUrl = el.querySelector(".href-next__url-inputs");
                const inputsEmail = el.querySelector(
                  ".href-next__email-inputs"
                );
                const inputType = el.querySelector(".href-next__type");
                inputType.addEventListener("change", (ev) => {
                  //@ts-ignore
                  switch (ev.target.value) {
                    case "url":
                      //@ts-ignore
                      inputsUrl.style.display = "";
                      //@ts-ignore
                      inputsEmail.style.display = "none";
                      break;
                    case "email":
                      //@ts-ignore
                      inputsUrl.style.display = "none";
                      //@ts-ignore
                      inputsEmail.style.display = "";
                      break;
                  }
                });

                return el;
              },
            });
          }
        );
      });
    };

    script.setAttribute(
      "src",
      "https://cdn.jsdelivr.net/gh/Luwfy/luwfy-grapesjs@4caea03/js/luwfy.grapes.js"
    );
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    console.log("PROPS", this.props.data.componentConfig);
    console.log("MODEL_INPUT", this.model);
    console.log("PARSE_INPUT", this.parserLuwfyToGoJs());

    //TODO create context observable goJsCanvasObservable

    // this.model = this.parserLuwfyToGoJs();

    this.model = this.props.data.componentConfig;

    this.init();

    window["updateCanvas"] = this.updateCanvas;
    window["model"] = this.myDiagram;
    window["CANVAS"] = this;

    //TODO add to function
    // .addNodeData({
    //   outputs: 1,
    //   outputSuccess: false,
    //   outputError: false,
    //   faceImage: "2d7dc200-a06f-4af1-b559-f3bc9c163a7b",
    //   input: true,
    //   color: "#FFC300 ",
    //   color2: "red",
    //   type: "network",
    //   formSettings: "59d69780-65c8-4ba3-ba3a-f91c25e4f96d",
    //   formWizzard: null,
    //   name: "http request",
    //   key: -1,
    //   loc: "0 80",
    // })
  }

  save() {
    document.getElementById("mySavedModel")[
      "value"
    ] = this.myDiagram.model.toJson();
    this.myDiagram.isModified = false;
  }

  load() {
    let templatesArr = [
      {
        outputs: 1,
        condition: {
          switch: 1,
        },
        outputSuccess: false,
        outputError: false,
        faceImage: "2d7dc200-a06f-4af1-b559-f3bc9c163a7b",
        input: true,
        color: "#FFC300 ",
        type: "network",
        formSettings: "59d69780-65c8-4ba3-ba3a-f91c25e4f96d",
        formWizzard: null,
        name: "http request",
        key: -1,
      },

      {
        outputs: 1,
        outputSuccess: false,
        outputError: false,
        faceImage: null,
        input: true,
        color: "#f403fc",
        color2: "red",
        type: "function",
        formSettings: "ecb4f8b3-3fa9-4736-88c2-2091d5e4b864",
        formWizzard: null,
        name: "change",
        key: -2,
      },
      {
        outputs: 0,
        outputSuccess: false,
        outputError: false,
        faceImage: null,
        input: true,
        color: "#273f8a",
        color2: "red",
        type: "common",
        formSettings: "4554b140-b389-4c85-b3b8-68f00005b332",
        formWizzard: null,
        name: "debug",
        key: -3,
        loc: "0 3360",
      },
      {
        outputs: 3,
        outputSuccess: false,
        outputError: false,
        faceImage: null,
        input: false,
        color: "#93f916",
        color2: "red",
        type: "RxJS",
        formSettings: "eaf74626-5f8a-4867-bfc2-f0e691abf3cd",
        formWizzard: null,
        name: "rx subscriber",
        key: -6,
        loc: "0 3360",
      },
      {
        outputs: 1,
        outputSuccess: false,
        outputError: false,
        type: "view in",
        name: "view in",
        color: "#93f916",
        key: "b9f855d8.bb2a28",
        z: "6f9eef4f.2aa0e",
      },
      {
        outputs: 1,
        outputSuccess: false,
        outputError: false,
        type: "template",
        condition: {
          switch: 0,
        },

        name: "template",
        color: "#93f916",
        z: "6f9eef4f.2aa0e",
        key: "-1000",
      },
      {
        outputs: 1,
        condition: {
          switch: 1,
        },

        outputSuccess: false,
        outputError: false,
        type: "function",
        name: "function",
        color: "#93f916",
        z: "6f9eef4f.2aa0e",
        key: "-1001",
      },
    ];

    setTimeout(() => {
      this.myDiagram.model = go.GraphLinksModel.fromJson(this.model);
    }, 1000);

    //TODO set template type

    console.log("TTTEERRR", this.model.nodeDataArray);
    this.model.nodeDataArray.forEach((arrElem) => {
      let outputPorts = [];
      for (
        let i = 0;
        i < arrElem.outputs + +arrElem.outputSuccess + +arrElem.outputError;
        i++
      ) {
        outputPorts.push(this.makePort(i + 1, false, arrElem.color));
      }

      this.makeTemplate(
        arrElem.type,
        arrElem.name,
        null,
        arrElem.color,
        [this.makePort("INPUT", true, arrElem.color)],
        [...outputPorts],
        arrElem.outputs,
        arrElem.condition,
        "e905"
      );
    });
  }

  //CALL ON MODIFY
  saveModel(e) {
    console.log(
      "MODEL_TETETTETE",
      e,
      JSON,
      JSON.parse(this.myDiagram.model.toJson())
    );

    // this.eventsOut.emit({
    //   event: "modified",
    //   data: JSON.parse(this.myDiagram.model.toJson()),
    // });

    console.log("SAVE_MODEL_1", window["Luwfy"].contexts.contexts.observable);
    console.log(
      "SAVE_MODEL_2",
      window["Luwfy"].contexts.contexts.observable.context[
        "goJsCanvasObservable"
      ]
    );
    console.log(
      "SAVE_MODEL_2",
      window["Luwfy"].contexts.contexts.observable.context[
        "goJsCanvasObservable"
      ].subscriber
    );

    window["Luwfy"].contexts.contexts.observable.context[
      "goJsCanvasObservable"
    ].subscriber.next({ model: JSON.parse(this.myDiagram.model.toJson()) });

    //TODO uncomment

    // window["luwfy"].contexts.contexts.observable.context[
    //   "goJsCanvasObservable"
    // ].subscriber.next({ model: JSON.parse(this.myDiagram.model.toJson()) });
  }

  stayInFixedArea(part, pt, gridpt) {
    var diagram = part.diagram;
    if (diagram === null) return pt;
    // compute the document area without padding
    var v = diagram.documentBounds.copy();
    v.subtractMargin(diagram.padding);
    // get the bounds of the part being dragged
    var b = part.actualBounds;
    var loc = part.location;
    // now limit the location appropriately
    var x = Math.max(v.x, Math.min(pt.x, v.right - b.width)) + (loc.x - b.x);
    var y = Math.max(v.y, Math.min(pt.y, v.bottom - b.height)) + (loc.y - b.y);
    return new go.Point(x, y);
  }

  makeTemplate(
    typename,
    name,
    icon,
    background,
    inports,
    outports,
    outportsCount,
    condition,
    iconsInside
  ) {
    console.log("CONDITION", condition && condition.switch == 0);
    let groupHeigth = outportsCount <= 1 ? 80 : 80 + (outportsCount - 2) * 27;
    var background2 = go.Brush.lightenBy(background, 0.3);
    var background3 = go.Brush.lightenBy(background, 0.5);
    var midbrush = this.$(go.Brush, go.Brush.Linear, {
      0: background3,
      0.5: background2,
      1: background,
    });

    condition && groupHeigth + 30;

    let deltaWidth = 20 / groupHeigth;

    var node = this.$(
      go.Node,
      "Auto",
      {
        // dragComputation: this.avoidNodeOverlap,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        shadowVisible: true,
        isLayoutPositioned: true,

        //TODO NOT DELETE
        // deletable: false,
        //prevent block from moving
        // movable: false,
        // //prevent from delete
        // canDelete: false,
        // //prevent from copy
        // copyable: false,
        //TODO DINISH NOT DELETE

        shadowBlur: 10,
        selectionAdorned: false,
        isShadowed: true,
        shadowColor: "#00000029",
        mouseEnter: (e, obj) => {
          //TODO uncomment
          obj.part.findObject("inner-block-btn").visible = true;
        },
        mouseLeave: (e, obj) => {
          obj.part.findObject("inner-block-btn").visible = false;
        },
      },

      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),

      this.$(
        go.Panel,
        "Vertical",
        { width: 90, height: groupHeigth + 25 },

        this.$(go.TextBlock, name || typename, {
          margin: new go.Margin(0, 0, 5, 0),
          alignment: new go.Spot(0.5, 0),
          // editable: true,
          stroke: "black",
          font: "12px bold  Roboto, sans-serif",
        }),

        this.$(
          go.Shape,
          "RoundedRectangle",
          {
            fill: midbrush,
            // stroke: background,
            strokeWidth: 0,
            parameter1: 10,
            width: 80,
            height: groupHeigth,
            mouseEnter: (e, obj) => {
              // console.log("obj", obj);
              // console.log("BBBB", this.myDiagram.findNodeForKey("inner-block-btn"));
              // obj.part.findObject("inner-block-btn").visible = true;
            },
            mouseLeave: (e, obj) => {
              console.log("MOUSE_LEAVE_BLOCK");
            },
          }
          // new go.Binding("stroke", "isSelected", function (sel) {
          //   if (sel) return "yellow"; else return background;
          // }).ofObject(""),
        )
      ),

      //PUSH BUTTON
      this.$(
        go.Panel,
        "Auto",
        {
          alignment: new go.Spot(0.5, 1),
          visible: condition && condition.switch == 0,
          width: 45,
          height: 23,
          name: "push-btn-wrapper",
          click: (e, obj) => {},
        },

        this.$(go.Shape, "RoundedRectangle", {
          alignment: new go.Spot(0.5, 1),
          fill: "white",
          name: "push-btn-tube",
          parameter1: 800,
          stroke: "white",
          // stroke: background,
          width: 40,
          height: 18,
          strokeWidth: 1,
        }),

        this.$(go.TextBlock, {
          font: "12px  Roboto, sans-serif",
          cursor: "pointer",
          click: (e, obj) => {
            //TODO add click for button
          },
          text: "PUSH",
        })
      ),

      //SWITCH BUTTON
      this.$(
        go.Panel,
        "Auto",
        {
          alignment: new go.Spot(0.5, 1),
          visible: condition && condition.switch == 1,
          width: 45,
          height: 23,
          name: "switch-btn-wrapper",
          click: (e, obj) => {
            let toogle = obj.part.findObject("switch-btn-toogle");
            let btnTube = obj.part.findObject("switch-btn-tube");
            let startPosition = new go.Spot(0, 0.5);
            let endPosition = new go.Spot(1, 0.5);
            if (toogle.alignment.x == startPosition.x) {
              btnTube.fill = "gray";
              toogle.alignment = endPosition;
            } else {
              btnTube.fill = "red";
              toogle.alignment = startPosition;
            }
          },
        },

        this.$(go.Shape, "RoundedRectangle", {
          alignment: new go.Spot(0.5, 1),
          fill: "white",
          stroke: "black",
          width: 40,
          height: 18,
          strokeWidth: 1,
          name: "switch-btn-tube",
          parameter1: 800,
        }),

        this.$(go.Shape, "Ellipse", {
          fill: "black",
          alignment: new go.Spot(0, 0.5),
          width: 14,
          name: "switch-btn-toogle",
          height: 14,
          cursor: "pointer",
          stroke: "white",
          strokeWidth: 2,
        })
      ),

      //END switch Button

      this.$(go.TextBlock, name || typename, {
        alignment: new go.Spot(0.5, 0.7),
        maxSize: new go.Size(100, 50),
        stroke: "white",
        font: "12px  Roboto, sans-serif",
      }),

      this.$(
        go.Panel,
        "Auto",
        {
          visible: false,
          name: "inner-block-btn",
          width: 86,
          height: groupHeigth,
        },

        this.$(
          go.Shape,
          "RoundedRectangle",
          {
            fill: "transparent",
            // stroke: background,
            strokeWidth: 0,
            parameter1: 10,
            width: 86,
            height: groupHeigth,
          }
          // new go.Binding("stroke", "isSelected", function (sel) {
          //   if (sel) return "yellow"; else return background;
          // }).ofObject(""),
        ),

        //leftTopIcon
        this.$(go.TextBlock, {
          font: "16px icomoon, icomoon",
          alignment: new go.Spot(0.1, 0.1 + deltaWidth / 2),
          name: GoJsBlockIconsType.DebugeIcon,
          cursor: "pointer",
          text: unescape("%u" + GoJsBlockIconsValue.DebugeIcon),

          // mouseEnter: (e, obj) => {
          //   obj.part.findObject(GoJsBlockIconsValue.DebugeIcon).stroke = "red";
          // },
          // mouseLeave: (e, obj) => {
          //   obj.part.findObject(GoJsBlockIconsValue.DebugeIcon).stroke =
          //     "black";
          // },

          click: (e, obj) => {
            console.log(
              "BTN_CLICK",
              GoJsBlockIconsValue.DebugeIcon,
              name,
              typename
            );
          },
        }),

        //right top icon
        this.$(go.TextBlock, {
          font: "16px icomoon, icomoon",
          alignment: new go.Spot(0.9, 0.1 + deltaWidth / 2),
          name: GoJsBlockIconsType.DeleteIcon,
          cursor: "pointer",
          text: unescape("%u" + GoJsBlockIconsValue.DeleteIcon),

          // mouseEnter: (e, obj) => {
          //   obj.part.findObject(GoJsBlockIconsValue.DeleteIcon).stroke = "red";
          // },
          // mouseLeave: (e, obj) => {
          //   obj.part.findObject(GoJsBlockIconsValue.DeleteIcon).stroke =
          //     "black";
          // },

          click: (e, obj) => {
            console.log(
              "BTN_CLICK",
              GoJsBlockIconsValue.DeleteIcon,
              name,
              typename
            );
          },
        }),

        //center icon
        this.$(go.TextBlock, {
          alignment: new go.Spot(0.5, 0.5 + deltaWidth / 2),
          font: "16px icomoon, icomoon",
          name: GoJsBlockIconsType.SettingsIcon,
          cursor: "pointer",
          text: unescape("%u" + GoJsBlockIconsValue.SettingsIcon),

          // mouseEnter: (e, obj) => {
          //   obj.part.findObject(GoJsBlockIconsValue.SettingsIcon).stroke =
          //     "red";
          // },
          // mouseLeave: (e, obj) => {
          //   obj.part.findObject(GoJsBlockIconsValue.SettingsIcon).stroke =
          //     "black";
          // },

          click: (e, obj) => {
            console.log(
              "BTN_CLICK",
              GoJsBlockIconsValue.SettingsIcon,
              name,
              typename
            );
          },
        }),

        //bottom left icon
        this.$(go.TextBlock, {
          alignment: new go.Spot(0.1, 0.9 + deltaWidth / 2),

          font: "16px icomoon, icomoon",

          name: GoJsBlockIconsType.InformationIcon,
          cursor: "pointer",
          text: unescape("%u" + GoJsBlockIconsValue.InformationIcon),

          // mouseEnter: (e, obj) => {
          //   obj.part.findObject(GoJsBlockIconsValue.InformationIcon).stroke =
          //     "red";
          // },
          // mouseLeave: (e, obj) => {
          //   obj.part.findObject(GoJsBlockIconsValue.InformationIcon).stroke =
          //     "black";
          // },

          click: (e, obj) => {
            console.log(
              "BTN_CLICK",
              GoJsBlockIconsValue.InformationIcon,
              name,
              typename
            );
          },
        }),

        //bottom right icon
        this.$(go.TextBlock, {
          alignment: new go.Spot(0.9, 0.9 + deltaWidth / 2),
          font: "16px icomoon, icomoon",
          name: GoJsBlockIconsType.CommentIcon,
          cursor: "pointer",
          text: unescape("%u" + GoJsBlockIconsValue.CommentIcon),
          // mouseEnter: (e, obj) => {
          //   obj.part.findObject(GoJsBlockIconsType.CommentIcon).stroke = "red";
          // },
          // mouseLeave: (e, obj) => {
          //   obj.part.findObject(GoJsBlockIconsType.CommentIcon).stroke =
          //     "black";
          // },

          click: (e, obj) => {
            console.log(
              "BTN_CLICK",
              GoJsBlockIconsType.CommentIcon,
              name,
              typename
            );
          },
        })
      ),
      // inports,
      this.$(
        go.Panel,
        "Vertical",
        {
          alignment: new go.Spot(0, 0.5 + deltaWidth / 2),
        },
        inports
      ),

      this.$(
        go.Panel,
        "Vertical",
        {
          alignment: new go.Spot(1, 0.5 + deltaWidth / 2),
        },
        outports
      )
    );

    this.myDiagram.nodeTemplateMap.set(typename, node);
    return node;
  }

  makePort(name, leftside, color?) {
    var background2 = go.Brush.lightenBy(color, 0.3);
    var background3 = go.Brush.lightenBy(color, 0.5);
    var midbrush = this.$(go.Brush, go.Brush.Linear, {
      0: background3,
      0.5: background2,
      1: color,
    });

    var port = this.$(go.Shape, "Ellipse", {
      fill: "white",
      // alignment: new go.Spot(1, 1),
      width: 14,
      height: 14,
      portId: name,
      cursor: "pointer",
      stroke: "green",
      strokeWidth: 2,
    });

    var panel = this.$(
      go.Panel,
      "Horizontal",
      {
        margin: new go.Margin(2, 0),
        // width: 30,
        // height: 30
      }

      //TODO shape label
      // this.$(go.Shape,
      //   {
      //     name: "SHAPE",
      //     fill: "black", stroke: "gray",
      //     // geometryString: "F1 m 0,0 l 5,0 1,4 -1,4 -5,0 1,-4 -1,-4 z",
      //     spot1: new go.Spot(0, 0, 5, 1),  // keep the text inside the shape
      //     spot2: new go.Spot(1, 1, -5, 0),
      //     // scale: 1,
      //     // startX: 0,
      //     // endX: 20,
      //     // startY: 0,
      //     // endY: 20,
      //     // some port-related properties

      //     // figure: "SquareArrow",
      //     toSpot: go.Spot.Left,
      //     toLinkable: false,
      //     fromSpot: go.Spot.Right,
      //     fromLinkable: false,
      //     cursor: "pointer"
      //   },

      //   // ))
      // )
    );

    // set up the port/panel based on which side of the node it will be on
    if (leftside) {
      port.toSpot = go.Spot.Left;
      //TODO SET TO/FROM LINKABLE
      port.toLinkable = true;
      port.stroke = "white";
      (port.strokeWidth = 2),
        (port.fill = midbrush),
        // panel.alignment = go.Spot.TopLeft;
        panel.add(port);
    } else {
      port.fromSpot = go.Spot.Right;
      port.fromLinkable = true;
      (port.stroke = "white"),
        (port.strokeWidth = 2),
        (port.fill = midbrush),
        // panel.alignment = go.Spot.TopRight;
        panel.add(port);
    }
    return panel;
  }
}
