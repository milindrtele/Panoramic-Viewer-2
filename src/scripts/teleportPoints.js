import * as THREE from "three";
import SpriteMixer from "../utils/spriteMixer";
import { NodeToyMaterial } from "@nodetoy/three-nodetoy";
import { data } from '../shaders/pointerArrow/shaderData';

class TeleportPoints {
    constructor(scene, teleportUrl) {
        this.scene = scene;
        this.teleportPoints = [];
        this.init(teleportUrl);
    }

    async fetchTeleportPoints(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch teleport points:", error);
            return [];
        }
    }

    async init(teleportUrl) {
        const teleportData = await this.fetchTeleportPoints(teleportUrl);
        
        // this.spriteMixer = SpriteMixer(); //sprite mixer
        // const textureLoader = new THREE.TextureLoader(); //texture loader

        // textureLoader.load("/icons/res_B4E254CA_8134_3CD8_41C5_7288D8741FAE_0.png", (texture)=> {

        //     // An ActionSprite is instantiated with these arguments :
        //     // - which THREE.Texture to use
        //     // - the number of columns in your animation
        //     // - the number of rows in your animation
        //     const actionSprite = this.spriteMixer.ActionSprite( texture, 4, 6 );
        //     actionSprite.setFrame( 21 );

        //     // Two actions are created with these arguments :
        //     // - which actionSprite to use
        //     // - index of the beginning of the action
        //     // - index of the end of the action
        //     // - duration of ONE FRAME in the animation, in milliseconds
        //     var actions = {};
        //     actions.forward = this.spriteMixer.Action(actionSprite, 0, 20, 40);

        //     actionSprite.scale.set(1.7, 2, 1);
        //     this.scene.add( actionSprite );
        // });

        const textureLoader = new THREE.TextureLoader(); //texture loader 
        textureLoader.load("/icons/Entry_single.png", (texture)=> {
            teleportData.forEach((point) => {
                console.log(point);
                //const geometry = new THREE.RingGeometry(1, 1.5, 32);
                const geometry = new THREE.PlaneGeometry( 3, 3 );
                //const material = new THREE.MeshBasicMaterial({ transparent : true, side: THREE.DoubleSide, map: texture });
                let material = new NodeToyMaterial({
                    data,//url: "https://draft.nodetoy.co/xCgXwkaeS3aZJcaV"
                  });
                const arrow = new THREE.Mesh(geometry, material);
    
                // Position the ring using data from the JSON
                arrow.userData = {name: point.name};
                arrow.position.set(point.position.x, point.position.y, point.position.z);
                arrow.rotation.x = -Math.PI / 2; // Face upwards
                arrow.rotateOnWorldAxis(new THREE.Vector3(0,1,0), point.rotation.y * Math.PI/180);
                arrow.renderOrder = 1;
                this.scene.add(arrow);
    
                this.teleportPoints.push(arrow);
                //this.teleportPoints[point.name] = arrow;
            });
        });


    }

    async addToScene() {
        await this.removeFromScene();
        this.teleportPoints.forEach((point) => {
            if (!this.scene.children.includes(point)) {
                this.scene.add(point);
            }
        });
        console.log("Teleport points added to scene");
    }

    async removeFromScene() {
        this.teleportPoints.forEach((point) => {
            if (this.scene.children.includes(point)) {
                this.scene.remove(point);
            }
        });
        console.log("Teleport points removed from scene");
    }
}

export default TeleportPoints;
