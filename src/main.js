import "./styles.css";
import { Engine, Scene, HemisphericLight, Vector3, Curve3, FreeCamera, UniversalCamera, LoadAssetContainerAsync, Mesh, MeshBuilder } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

const METER_TO_INCH = 100/2.54;
const inchesToMeters = (inches) => inches * 0.0254;
const rad = (deg) => deg * (Math.PI/180);
const xTranslation = (distance, angle) => inchesToMeters(distance) * Math.cos(rad(angle));
const zTranslation = (distance, angle) => inchesToMeters(distance) * Math.sin(rad(angle)); 
const GUTTER_WIDTH = inchesToMeters(9.25);
const GUTTER_DEPTH = inchesToMeters(1.875);
const GUTTER_OFFSET = inchesToMeters(0.5);
const TOTAL_LANE_LENGTH = 19.16;
const LANE_WIDTH = inchesToMeters(41.5);
const LANE_LENGTH = inchesToMeters(60*12);
const PIN_DECK_LENGTH = TOTAL_LANE_LENGTH - LANE_LENGTH;
const APPROACH_LENGTH = inchesToMeters(15*12);
const LANE_DEPTH = GUTTER_DEPTH + GUTTER_OFFSET;
// pin adjacent distance 12in at 60 degrees
// angled distance to translation
// x => distance * cos(angle)
// y => distance * sin(angle)

const canvas = document.getElementById("renderCanvas");
/** @type {Engine} */
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
    // const camera = new UniversalCamera("camera", new Vector3(2, 2, 0), this);
    const camera = new UniversalCamera("camera", new Vector3(0, 1, -19.16-2), this);
    camera.setTarget(Vector3.Zero());
    await this.createPins(); 
    await this.createLane();
    await this.createGutters();
    return this;
  }

  async createLane(){

    const lane = MeshBuilder.CreateBox("lane", {
      width: LANE_WIDTH,
      height: LANE_DEPTH,
      depth: LANE_LENGTH
    }, this);
    lane.position = new Vector3(0, -(LANE_DEPTH/2), -(LANE_LENGTH/2));
    const pin_deck = MeshBuilder.CreateBox("pin_deck", {
      width: LANE_WIDTH,
      height: LANE_DEPTH,
      depth: PIN_DECK_LENGTH
    }, this);
    pin_deck.position = new Vector3(0, -(LANE_DEPTH/2), PIN_DECK_LENGTH/2);
  }

  async createGutters(){
    const curvePoints = [
      new Vector3(-(GUTTER_WIDTH/2), GUTTER_DEPTH/2, 0),
      new Vector3(0, -(GUTTER_DEPTH/2), 0),
      new Vector3(GUTTER_WIDTH/2, GUTTER_DEPTH/2, 0),
    ];
    const curve = Curve3.ArcThru3Points(...curvePoints, 32, false, false);
    const points = curve.getPoints();
    const profile = [
      ...points,
      new Vector3(points.at(-1).x, -points.at(-1).y, 0),
      new Vector3(points[0].x, -points[0].y, 0),
      points[0]
    ];
    
    const gutter = MeshBuilder.ExtrudeShape("gutter", {
      shape: profile,
      path: [new Vector3(0, 0, -(TOTAL_LANE_LENGTH/2)), new Vector3(0, 0, TOTAL_LANE_LENGTH/2)],
      // cap: Mesh.CAP_ALL,
      sideOrientation: Mesh.DOUBLESIDE
    }, this);
    gutter.position = new Vector3(LANE_WIDTH/2+GUTTER_WIDTH/2, -(GUTTER_DEPTH/2)-GUTTER_OFFSET, -(TOTAL_LANE_LENGTH/2)+(PIN_DECK_LENGTH));

    const gutter2 = gutter.createInstance("gutter2");
    gutter.position = new Vector3(-(LANE_WIDTH/2+GUTTER_WIDTH/2), -(GUTTER_DEPTH/2)-GUTTER_OFFSET, -(TOTAL_LANE_LENGTH/2)+(PIN_DECK_LENGTH));
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
