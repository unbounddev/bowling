import "./styles.css";
import { Engine, Scene, HemisphericLight, Vector3, FreeCamera, UniversalCamera, LoadAssetContainerAsync } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

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
    const pin = await loadModel(this, "Pin_High_Poly.glb");
    pin.addAllToScene();
    
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
