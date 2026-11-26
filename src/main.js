import "./styles.css";
import { Engine, Scene, HemisphericLight, Vector3, FreeCamera, UniversalCamera, LoadAssetContainerAsync } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

const METER_TO_INCH = 100/2.54;
const inchToMeter = (inches) => inches * 0.0254;
const rad = (deg) => deg * (Math.PI/180);
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
    const camera = new UniversalCamera("camera", new Vector3(0, 1, -1), this);
    camera.setTarget(Vector3.Zero());
    const pins = [];
    const pinLocations = [];
    const pin = await loadModel(this, "Pin_High_Poly.glb");
    for (let i = 0; i < 10; i++){
      pins.push(...pin.instantiateModelsToScene().rootNodes);
    }
    
    return this;
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
