import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

class HighLighter {
    constructor(highLighterUrl, scene) {
        this.glbLoader = new GLTFLoader();
        this.scene = scene;

        this.init(highLighterUrl);
    }

    init(glbUrl) {
        this.highLighterReady = new Promise((resolve, reject) => {
            this.glbLoader.load(
                glbUrl,
                (gltf) => {
                    this.highLighterParent = gltf.scene.getObjectByName("highLighter_parent");
                    this.highLighterParent.children.forEach((object)=>{
                        // const texture = new THREE.TextureLoader().load("/icons/silhoette_texture_03.png");
                        // object.material = new THREE.MeshStandardMaterial({color:0x0000ff, opacity:0.5, transparent:true})
                        object.material.side= THREE.DoubleSide;
                        //object.material.depthWrite  = false;
                        object.renderOrder = 1;
                    })
                    resolve();
                },
                undefined,
                reject
            );
        });
    }

    async addToScene() {
        //await this.removeFromScene();
        try {
            await this.highLighterReady;
            if (this.highLighterParent) { // Ensure the object exists
                this.scene.add(this.highLighterParent);
                console.log(this.scene);
            } else {
                console.error("HighLighterParent is not found in the GLTF file.");
            }
        } catch (error) {
            console.error("Failed to add to scene:", error);
        }
    }

    async removeFromScene() {
        if (this.highLighterParent) { // Ensure the object exists before removing
            this.scene.remove(this.highLighterParent);
            console.log("HighLighterParent is removed");
        } else {
            console.error("HighLighterParent is not found in the scene.");
        }
    }
}

export default HighLighter;
