import "./styles.css";
import { Engine, Scene, HemisphericLight, Vector3, FreeCamera, UniversalCamera, LoadAssetContainerAsync, Mesh, MeshBuilder } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

const METER_TO_INCH = 100/2.54;
const inchesToMeters = (inches) => inches * 0.0254;
const rad = (deg) => deg * (Math.PI/180);
const xTranslation = (distance, angle) => inchesToMeters(distance) * Math.cos(rad(angle));
const zTranslation = (distance, angle) => inchesToMeters(distance) * Math.sin(rad(angle)); 
// pin adjacent distance 12in at 60 degrees
// angled distance to translation
// x => distance * cos(angle)
// y => distance * sin(angle)

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);

async function loadModel(scene, modelName){
  const container = await LoadAssetContainerAsync(`/assets/models/${modelName}`, scene); 

  return container;
}

class BowlingScene extends Scene {
  constructor(...params){
    super(...params);

  }

  async create(){
    
    const light = new HemisphericLight("light", new Vector3(1, 1, 0), this); 
    const camera = new UniversalCamera("camera", new Vector3(0, 2, -19.16/2-3), this);
    camera.setTarget(Vector3.Zero());
    await this.createPins(); 
    await this.createLane();
    return this;
  }

  async createLane(){
    const LANE_WIDTH = inchesToMeters(41.5);
    const TOTAL_LANE_LENGTH = 19.16;
    const LANE_LENGTH = inchesToMeters(60*12);
    const PIN_DECK_LENGTH = TOTAL_LANE_LENGTH - LANE_LENGTH;
    const APPROACH_LENGTH = inchesToMeters(15*12);
    const GUTTER_WIDTH = inchesToMeters(9.25);
    const GUTTER_DEPTH = inchesToMeters(1.875);

    const lane = MeshBuilder.CreateBox("lane", {
      width: LANE_WIDTH,
      height: GUTTER_DEPTH,
      depth: LANE_LENGTH
    }, this);
  }

  async createPins(){
    const pins = [];
    const startingLocation = Vector3.Zero();
    const pinLocations = [
      Vector3.Zero(), 
      new Vector3(xTranslation(12, 120),0,zTranslation(12, 120)),
      new Vector3(xTranslation(12, 60),0,zTranslation(12, 60)),
      new Vector3(xTranslation(12, 120),0,zTranslation(12, 120)),
      new Vector3(xTranslation(12, 60),0,zTranslation(12, 60)),
      new Vector3(xTranslation(12, 60),0,zTranslation(12, 60)),
      new Vector3(xTranslation(12, 120),0,zTranslation(12, 120)),
      new Vector3(xTranslation(12, 60),0,zTranslation(12, 60)),
      new Vector3(xTranslation(12, 60),0,zTranslation(12, 60)),
      new Vector3(xTranslation(12, 60),0,zTranslation(12, 60)),
    ];
    const pin = await loadModel(this, "Pin_High_Poly.glb");
    /** @type {Mesh} **/
    const pin1 = pin.instantiateModelsToScene().rootNodes[0];
    pin1.position = startingLocation.add(pinLocations[0]);
    const pin2 = pin.instantiateModelsToScene().rootNodes[0];
    pin2.position = pin1.position.add(pinLocations[1]);
    const pin3 = pin.instantiateModelsToScene().rootNodes[0];
    pin3.position = pin1.position.add(pinLocations[2]);
    const pin4 = pin.instantiateModelsToScene().rootNodes[0];
    pin4.position = pin2.position.add(pinLocations[3]);
    const pin5 = pin.instantiateModelsToScene().rootNodes[0];
    pin5.position = pin2.position.add(pinLocations[4]);
    const pin6 = pin.instantiateModelsToScene().rootNodes[0];
    pin6.position = pin3.position.add(pinLocations[5]);
    const pin7 = pin.instantiateModelsToScene().rootNodes[0];
    pin7.position = pin4.position.add(pinLocations[6]);
    const pin8 = pin.instantiateModelsToScene().rootNodes[0];
    pin8.position = pin4.position.add(pinLocations[7]);
    const pin9 = pin.instantiateModelsToScene().rootNodes[0];
    pin9.position = pin5.position.add(pinLocations[8]);
    const pin10 = pin.instantiateModelsToScene().rootNodes[0];
    pin10.position = pin6.position.add(pinLocations[9]);
    

  }
}

const scene = await new BowlingScene(engine).create();

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});
