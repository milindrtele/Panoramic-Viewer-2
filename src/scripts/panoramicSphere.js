import * as THREE from "three";
//import hotspotsData from "./json/pano_01.js";
import Hotspot from "../scripts/hotspot";
import HighLighter from "../scripts/highLighter";
import TeleportPoints from "../scripts/teleportPoints.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import TWEEN from "@tweenjs/tween.js";
import { NodeToyMaterial } from "@nodetoy/three-nodetoy";
import { data } from '../shaders/highLighter_shader_data_2';
import { tweenCameraToNewPositionAndRotation } from "./tweenCameraToNewPosition";

class PanoramicSphere {
  constructor(scene, camera, controls, cssScene, loadingManager, videoEmbed, tweenGroup) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.cssScene = cssScene;
    this.loadingManager = loadingManager;
    this.arrayOfHotspots = [];
    this.glbLoader = new GLTFLoader();
    this.highLighterParent = null;
    this.videoEmbedFunction = videoEmbed;
    this.tweenGroup = tweenGroup;
    this.highLighterMaterial = new NodeToyMaterial({
      data
      //url: "https://draft.nodetoy.co/1dqCVmwgFDXEEtkb"
    });

    this.isPanoramaAnimating = {isAnimating: false};

    this.init();
    //this.setUpHotspots("/json/pano_01.json");
  }

  init() {

    this.highLighterMaterial.uniforms.highLighterColor.value = {w:1, x:0.788, y:0.325, z:1};

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(1, 1, 1);

    geometry.addGroup(0, Infinity, 0);

    geometry.addGroup(0, Infinity, 1);

    const material_1 = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      opacity: 1,
      transparent: true,

    });
    const material_2 = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      opacity: 0,
      transparent: true,

    });
    const materialArray = [material_1, material_2];
    this.panoramicSphere = new THREE.Mesh(geometry, materialArray);
    //this.panoramicSphere = new THREE.Mesh(geometry, material_1);
    this.scene.add(this.panoramicSphere);

    console.log(this.panoramicSphere)
    // const cubeTexture = new THREE.CubeTextureLoader(this.loadingManager).load(
    //   [
    //     "/cubemap/jpeg_new/px.jpg",
    //     "/cubemap/jpeg_new/nx.jpg",
    //     "/cubemap/jpeg_new/ny.jpg",
    //     "/cubemap/jpeg_new/py.jpg",
    //     "/cubemap/jpeg_new/pz.jpg",
    //     "/cubemap/jpeg_new/nz.jpg",
    //   ],
    //   (panoTexture) => {
    //     panoTexture.flipY = true;
    //     const geometry = new THREE.SphereGeometry(500, 60, 40);
    //     geometry.scale(1, 1, 1);
    //     //pano_image.colorSpace = THREE.SRGBColorSpace;
    //     cubeTexture.colorSpace = THREE.SRGBColorSpace;
    //     const material = new THREE.MeshBasicMaterial({
    //       envMap: panoTexture,
    //       side: THREE.DoubleSide,
    //     });
    //     this.panoramicSphere = new THREE.Mesh(geometry, material);
    //     this.scene.add(this.panoramicSphere);
    //   },
    //   undefined,
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  setUpTeleportPoints = (url)=>{
    this.teleportPoints = new TeleportPoints(this.scene, url);
    console.log(this.teleportPoints);
  }

  setPanoramaTexture = (arrayOfImages, callBack) => {
    const cubeTexture = new THREE.CubeTextureLoader(this.loadingManager).load(
      arrayOfImages,
      (panoTexture) => {
        
        panoTexture.flipY = true;
        // this.panoramicSphere.material.envMap = panoTexture;

        this.panoramicSphere.material[1].envMap = panoTexture;

        const mat0 = this.panoramicSphere.material[0];
        const opacityTweenForMat0 = new TWEEN.Tween(mat0, this.tweenGroup)
          .to({ opacity: 0 }, 2500) // Target the fov property in the object
          .easing(TWEEN.Easing.Cubic.InOut)
          .onUpdate(() => {})
          .onComplete(() => {
            mat0.envMap = panoTexture;
            mat0.opacity = 1;
          });

        const mat1 = this.panoramicSphere.material[1];
        const opacityTweenForMat1 = new TWEEN.Tween(mat1, this.tweenGroup)
          .to({ opacity: 1 }, 2500) // Target the fov property in the object
          .easing(TWEEN.Easing.Cubic.InOut)
          .onStart(()=>{
            this.isPanoramaAnimating.isAnimating = true;
            if(callBack){
              callBack();
            }
          })
          .onUpdate(() => {})
          .onComplete(() => {
            this.isPanoramaAnimating.isAnimating = false;
            mat1.opacity = 0;
          });

        // tweenCameraToNewPositionAndRotation(
        //   this.camera,
        //   this.controls,
        //   this.controls.target,
        //   objectPosition,
        //   midpoint,
        //   null,
        //   this.tweenGroup
        // ).then(() => {
        //   this.controls.target.set(0, 0, 0);
        //   this.controls.update();
        //   this.camera.position.set(0, 0.35, 1);
        // });

        opacityTweenForMat0.start();
        opacityTweenForMat1.start();
      }
    );
  }

  async fetchHotspots(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch hotspots:", error);
      return [];
    }
  }

  async setUpHotspots(url) {
    try {
      if (this.arrayOfHotspots.length > 0) {
        // Wait for all `removeFromScene` calls to complete
        await Promise.all(
          this.arrayOfHotspots.map((hotspot) => hotspot.removeFromScene())
        );
        this.arrayOfHotspots = [];
      }

      const hotspotsData = await this.fetchHotspots(url);

      this.hotspotInstances = [];
      hotspotsData.forEach((hotspot) => {
        const {
          name,
          position,
          childHtmlUrl,
          buttonTextContent,
          stemHeight,
          buttonWidth,
          angle,
          flagPosition,
          callbackFunction,
          videoID,
          webURL,
        } = hotspot;

        const hotspotInstance = new Hotspot(
          this.cssScene,
          position,
          childHtmlUrl,
          buttonTextContent,
          stemHeight,
          buttonWidth,
          angle,
          flagPosition,
          callbackFunction ? window[callbackFunction] : undefined,
          this.videoEmbedFunction,
          videoID,
          webURL
        );

        //this.hotspotInstances[hotspot.name] = hotspotInstance;
        this.hotspotInstances.push(hotspotInstance);
        this.arrayOfHotspots.push(hotspotInstance);
      });
    } catch (error) {
      console.error("Failed to set up hotspots:", error);
    }
  }

  async setUpHighLighters(model_url) {
    console.log(this.highLighter);
    if (this.highLighter != null) {
      if (
        this.highLighterParent &&
        this.highLighterParent.children.length > 0
      ) {
        // Wait for all `removeFromScene` calls to complete
        await this.highLighter.removeFromScene();
        // await Promise.all(
        //   this.highLighterParent.children.map((highLighter) =>
        //     highLighter.removeFromScene()
        //   )
        // );
        this.highLighter = null;
        this.highLighterParent = null;
        if (model_url != null) {
          this.highLighter = new HighLighter(model_url, this.scene);
          this.highLighter.addToScene().then(() => {
            console.log(this.highLighter);
            this.highLighterParent = this.highLighter.highLighterParent;
            // const highLighterMaterial = new NodeToyMaterial({
            //   data
            //   //url: "https://draft.nodetoy.co/1dqCVmwgFDXEEtkb"
            // });
            this.highLighterParent.children.forEach((object)=>{
              object.material = this.highLighterMaterial.clone();
            })
          });
        }
      }
    } else {
      if (model_url != null) {
        this.highLighter = new HighLighter(model_url, this.scene);
        this.highLighter.addToScene().then(() => {
          console.log(this.highLighter);
          this.highLighterParent = this.highLighter.highLighterParent;
          // const highLighterMaterial = new NodeToyMaterial({
          //   data
          //   //url: "https://draft.nodetoy.co/1dqCVmwgFDXEEtkb"
          // });
          this.highLighterParent.children.forEach((object)=>{
            object.material = this.highLighterMaterial.clone();
          })
        });
      }
    }
  }

  async hideHotspots(){
    if(this.arrayOfHotspots.length > 0){
      this.arrayOfHotspots.forEach((hotspot)=>{
        hotspot.css2dObject.visible = false;
      })
    }
  }

  async showHotspots(){
    if(this.arrayOfHotspots.length > 0){
      this.arrayOfHotspots.forEach((hotspot)=>{
        hotspot.css2dObject.visible = true;
      })
    }
  }

  async hideHighLighters(){
    if(this.highLighterParent){
      this.highLighterParent.visible = false;
    }
  }

  async showHighLighters(){
    if(this.highLighterParent){
      this.highLighterParent.visible = true;
    }
  }

}

export default PanoramicSphere;
