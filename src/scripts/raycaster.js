import * as THREE from "three";
import { tweenCameraToNewPositionAndRotation } from "./tweenCameraToNewPosition";

class MyRaycaster {
  constructor(
    scene,
    panoSphere,
    camera,
    controls,
    canvas,
    highLightObjectArray,
    tweenGroup,
    startMatterPort,
  ) {
    this.scene = scene;
    this.panoSphere = panoSphere;
    this.camera = camera;
    this.controls = controls;
    this.canvas = canvas;
    this.highLightObjectArray = highLightObjectArray;
    this.tweenGroup = tweenGroup;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    // Bind the `onClick` method to the instance
    this.handleClick = this.onClick.bind(this);

    // Add event listener to the canvas
    this.canvas.addEventListener("click", this.handleClick);

    // Bind the `onHover` method to the instance
    this.handlePointerMove = this.onHover.bind(this);
    // Add event listener to the canvas
    this.canvas.addEventListener("mousemove", this.handlePointerMove);

    ///////////////

    this.hoveredObjectName = null;

    this.startMatterPort = startMatterPort;

    this.cameraAnimationState = { isCameraAnimating: false };

    this.initPointer();
  }

  initPointer() {
    const groundPlaneGeometry = new THREE.CircleGeometry(50, 32);
    const groundPlaneMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.groundPlane = new THREE.Mesh(groundPlaneGeometry, groundPlaneMaterial);
    this.groundPlane.position.set(0, -5, 0);
    this.groundPlane.rotation.set(-Math.PI / 2, 0, 0);
    this.groundPlane.visible = false;
    this.scene.add(this.groundPlane);

    const geometry = new THREE.RingGeometry(1, 1.5, 32, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    this.pointerPlane = new THREE.Mesh(geometry, material);
    this.pointerPlane.position.set(0, -4.9, 0);
    this.pointerPlane.rotation.set(-Math.PI / 2, 0, 0);
    this.scene.add(this.pointerPlane);
  }

  async findData(url, panoName) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      return data.find((item) => {
        console.log(item);
        return item.name == panoName;
      });
      // return data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return [];
    }
  }

  onClick() {
    if (this.intersects && this.intersects.length > 0) {
      if (this.intersects[0].object.userData) {
        if (this.intersects[0].object.userData.name == "living_room_pano_1") {
          let midpoint = new THREE.Vector3();
          //let elevatedPoint = { x: this.intersects[0].object.position.x, y: 5, z: this.intersects[0].object.position.z }
          let elevatedPoint = { x: 10, y: 5, z: 15 }
          midpoint
            .addVectors({ x: 0, y: 0, z: 0 }, elevatedPoint)
            .divideScalar(3);

          this.hoveredObjectName = null;

          this.findData("/json/flat_panorama.json", "living_room_pano_1").then(
            (panoData) => {
              //
              let callBack = () => {
                tweenCameraToNewPositionAndRotation(
                  this.camera,
                  this.controls,
                  this.controls.target,
                  this.intersects[0].object.position,
                  midpoint,
                  null,
                  this.tweenGroup,
                  this.cameraAnimationState
                ).then((isAnimating) => {
                  this.cameraAnimationState.isCameraAnimating = isAnimating;
                  this.intersects = [];
                  this.panoSphere
                    .setUpHotspots(panoData.hotSpotJsonUrl)
                    .then(() => {
                      this.panoSphere.hotspotInstances.forEach((hotspot) => {
                        console.log(hotspot);
                        hotspot.addToScene();
                      });
                      // this.panoSphere.setUpHighLighters(
                      //   panoData.highLighterJsonUrl
                      // );
                      this.panoSphere.setUpTeleportPoints(panoData.teleportPointsUrl);
                      this.panoSphere.teleportPoints.removeFromScene();
                      this.panoSphere.teleportPoints.addToScene();
                    });
                });
              };

              this.panoSphere.setPanoramaTexture(
                panoData.panoTextureUrlArray,
                callBack
              );
            }
          );
        } else if (this.intersects[0].object.userData.name == "bedroom_1") {
          let midpoint = new THREE.Vector3();
          midpoint
            .addVectors({ x: 0, y: 0, z: 0 }, this.intersects[0].object.position)
            .divideScalar(3);

          this.hoveredObjectName = null;

          this.findData("/json/flat_panorama.json", "bedroom_1").then(
            (panoData) => {
              //
              let callBack = () => {
                tweenCameraToNewPositionAndRotation(
                  this.camera,
                  this.controls,
                  this.controls.target,
                  this.intersects[0].object.position,
                  midpoint,
                  null,
                  this.tweenGroup,
                  this.cameraAnimationState
                ).then((isAnimating) => {
                  this.cameraAnimationState.isCameraAnimating = isAnimating;
                  this.intersects = [];
                  this.panoSphere
                    .setUpHotspots(panoData.hotSpotJsonUrl)
                    .then(() => {
                      this.panoSphere.hotspotInstances.forEach((hotspot) => {
                        console.log(hotspot);
                        hotspot.addToScene();
                      });
                      // this.panoSphere.setUpHighLighters(
                      //   panoData.highLighterJsonUrl
                      // );
                    });
                });
              };

              this.panoSphere.setPanoramaTexture(
                panoData.panoTextureUrlArray,
                callBack
              );
            }
          );

        } else if (this.intersects[0].object.userData.name == "bedroom_2") {
          let midpoint = new THREE.Vector3();
          midpoint
            .addVectors({ x: 0, y: 0, z: 0 }, this.intersects[0].object.position)
            .divideScalar(3);

          this.hoveredObjectName = null;

          this.findData("/json/flat_panorama.json", "bedroom_2").then(
            (panoData) => {
              //

              let callBack = () => {
                tweenCameraToNewPositionAndRotation(
                  this.camera,
                  this.controls,
                  this.controls.target,
                  this.intersects[0].object.position,
                  midpoint,
                  null,
                  this.tweenGroup,
                  this.cameraAnimationState
                ).then((isAnimating) => {
                  this.cameraAnimationState.isCameraAnimating = isAnimating;
                  this.intersects = [];
                  this.panoSphere
                    .setUpHotspots(panoData.hotSpotJsonUrl)
                    .then(() => {
                      this.panoSphere.hotspotInstances.forEach((hotspot) => {
                        console.log(hotspot);
                        hotspot.addToScene();
                      });
                      // this.panoSphere.setUpHighLighters(
                      //   panoData.highLighterJsonUrl
                      // );
                    });
                });
              };

              this.panoSphere.setPanoramaTexture(
                panoData.panoTextureUrlArray,
                callBack
              );
            }
          );
        }else if (this.intersects[0].object.userData.name == "bedroom_3") {
          let midpoint = new THREE.Vector3();
          midpoint
            .addVectors({ x: 0, y: 0, z: 0 }, this.intersects[0].object.position)
            .divideScalar(3);

          this.hoveredObjectName = null;

          this.findData("/json/flat_panorama.json", "bedroom_3").then(
            (panoData) => {
              //

              let callBack = () => {
                tweenCameraToNewPositionAndRotation(
                  this.camera,
                  this.controls,
                  this.controls.target,
                  this.intersects[0].object.position,
                  midpoint,
                  null,
                  this.tweenGroup,
                  this.cameraAnimationState
                ).then((isAnimating) => {
                  this.cameraAnimationState.isCameraAnimating = isAnimating;
                  this.intersects = [];
                  this.panoSphere
                    .setUpHotspots(panoData.hotSpotJsonUrl)
                    .then(() => {
                      this.panoSphere.hotspotInstances.forEach((hotspot) => {
                        console.log(hotspot);
                        hotspot.addToScene();
                      });
                      // this.panoSphere.setUpHighLighters(
                      //   panoData.highLighterJsonUrl
                      // );
                    });
                });
              };

              this.panoSphere.setPanoramaTexture(
                panoData.panoTextureUrlArray,
                callBack
              );
            }
          );
        }
      }
    }
  }

  // onClick() {
  //   if (this.intersects && this.intersects.length > 0) {
  //     if (this.intersects[0].object.name == "pano_01_plane_01") {
  //       this.startMatterPort();
  //     } else if (this.intersects[0].object.name == "pano_01_plane_02") {
  //       let midpoint = new THREE.Vector3();
  //       midpoint
  //         .addVectors({ x: 0, y: 0, z: 0 }, this.intersects[0].object.position)
  //         .divideScalar(3);

  //       this.hoveredObjectName = null;

  //       this.findData("/json/flat_panorama.json", "pano_1").then(
  //         (panoData) => {
  //           //
  //           let callBack = () => {
  //             tweenCameraToNewPositionAndRotation(
  //               this.camera,
  //               this.controls,
  //               this.controls.target,
  //               this.intersects[0].object.position,
  //               midpoint,
  //               null,
  //               this.tweenGroup,
  //               this.cameraAnimationState
  //             ).then((isAnimating) => {
  //               this.cameraAnimationState.isCameraAnimating = isAnimating;
  //               this.intersects = [];
  //               this.panoSphere
  //                 .setUpHotspots(panoData.hotSpotJsonUrl)
  //                 .then(() => {
  //                   this.panoSphere.hotspotInstances.forEach((hotspot) => {
  //                     console.log(hotspot);
  //                     hotspot.addToScene();
  //                   });
  //                   // this.panoSphere.setUpHighLighters(
  //                   //   panoData.highLighterJsonUrl
  //                   // );
  //                 });
  //             });
  //           };

  //           this.panoSphere.setPanoramaTexture(
  //             panoData.panoTextureUrlArray,
  //             callBack
  //           );
  //         }
  //       );

  //       //   tweenCameraToNewPositionAndRotation(
  //       //     this.camera,
  //       //     this.controls,
  //       //     this.controls.target,
  //       //     this.intersects[0].object.position,
  //       //     midpoint,
  //       //     null,
  //       //     this.tweenGroup
  //       //   ).then(() => {
  //       //     // this.controls.target.set(0, 0, 0);
  //       //     // this.controls.update();
  //       //     // this.camera.position.set(0, 0.35, 1);
  //       //     this.intersects = [];

  //       //     // this.findData("/json/flat_panorama.json", "pano_1").then(
  //       //     //   (panoData) => {
  //       //     //     this.panoSphere
  //       //     //       .setUpHotspots(panoData.hotSpotJsonUrl)
  //       //     //       .then(() => {
  //       //     //         this.panoSphere.hotspotInstances.forEach((hotspot) => {
  //       //     //           console.log(hotspot);
  //       //     //           hotspot.addToScene();
  //       //     //         });
  //       //     //         this.panoSphere.setUpHighLighters(
  //       //     //           panoData.highLighterJsonUrl
  //       //     //         );
  //       //     //       });
  //       //     //   }
  //       //     // );

  //       //     // this.panoSphere.setUpHotspots("/json/pano_02.json").then(() => {
  //       //     //   this.panoSphere.hotspotInstances.forEach((hotspot) => {
  //       //     //     console.log(hotspot);
  //       //     //     hotspot.addToScene();
  //       //     //   });
  //       //     //   this.panoSphere.setUpHighLighters(
  //       //     //     "models/new_highlighters/pano_02_highLighters/pano_02_highLighters_1.glb"
  //       //     //   );
  //       //     // });
  //       //   });
  //       // };

  //       // this.panoSphere.setPanoramaTexture(
  //       //   [
  //       //     "/cubemap/panorama_02/px.png",
  //       //     "/cubemap/panorama_02/nx.png",
  //       //     "/cubemap/panorama_02/ny.png",
  //       //     "/cubemap/panorama_02/py.png",
  //       //     "/cubemap/panorama_02/pz.png",
  //       //     "/cubemap/panorama_02/nz.png",
  //       //   ],
  //       //   callBack
  //       // );
  //     } else if (this.intersects[0].object.name == "pano_02_plane_01") {
  //       let midpoint = new THREE.Vector3();
  //       midpoint
  //         .addVectors({ x: 0, y: 0, z: 0 }, this.intersects[0].object.position)
  //         .divideScalar(3);

  //       this.hoveredObjectName = null;

  //       this.findData("/json/flat_panorama.json", "pano_2").then(
  //         (panoData) => {
  //           //

  //           let callBack = () => {
  //             tweenCameraToNewPositionAndRotation(
  //               this.camera,
  //               this.controls,
  //               this.controls.target,
  //               this.intersects[0].object.position,
  //               midpoint,
  //               null,
  //               this.tweenGroup,
  //               this.cameraAnimationState
  //             ).then((isAnimating) => {
  //               this.cameraAnimationState.isCameraAnimating = isAnimating;
  //               this.intersects = [];
  //               this.panoSphere
  //                 .setUpHotspots(panoData.hotSpotJsonUrl)
  //                 .then(() => {
  //                   this.panoSphere.hotspotInstances.forEach((hotspot) => {
  //                     console.log(hotspot);
  //                     hotspot.addToScene();
  //                   });
  //                   // this.panoSphere.setUpHighLighters(
  //                   //   panoData.highLighterJsonUrl
  //                   // );
  //                 });
  //             });
  //           };

  //           this.panoSphere.setPanoramaTexture(
  //             panoData.panoTextureUrlArray,
  //             callBack
  //           );
  //         }
  //       );

  //       //   tweenCameraToNewPositionAndRotation(
  //       //     this.camera,
  //       //     this.controls,
  //       //     this.controls.target,
  //       //     this.intersects[0].object.position,
  //       //     midpoint,
  //       //     null,
  //       //     this.tweenGroup
  //       //   ).then(() => {
  //       //     // this.controls.target.set(0, 0, 0);
  //       //     // this.controls.update();
  //       //     //this.camera.position.set(0, 0.35, 1);
  //       //     this.intersects = [];
  //       //     this.panoSphere.setUpHotspots("/json/pano_03.json").then(() => {
  //       //       this.panoSphere.hotspotInstances.forEach((hotspot) => {
  //       //         hotspot.addToScene();
  //       //       });
  //       //       this.panoSphere.setUpHighLighters(null);
  //       //     });
  //       //   });
  //       // };

  //       // this.panoSphere.setPanoramaTexture(
  //       //   [
  //       //     "/cubemap/panorama_03/px.png",
  //       //     "/cubemap/panorama_03/nx.png",
  //       //     "/cubemap/panorama_03/ny.png",
  //       //     "/cubemap/panorama_03/py.png",
  //       //     "/cubemap/panorama_03/pz.png",
  //       //     "/cubemap/panorama_03/nz.png",
  //       //   ],
  //       //   callBack
  //       // );
  //     }
  //   }
  // }

  onHover(event) {

    if (this.panoSphere) {
      const rect = this.canvas.getBoundingClientRect();
      this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);

      this.intersects = this.raycaster.intersectObjects([this.groundPlane, ...this.panoSphere.teleportPoints.teleportPoints]);

      if (this.intersects.length > 0) {
        const pointOfIntersection = this.intersects[0].point.clone(); // Clone the vector to avoid unintended side effects

        pointOfIntersection.y = -4.9; // Modify the y-coordinate safely

        this.pointerPlane.position.set(
          pointOfIntersection.x,
          pointOfIntersection.y,
          pointOfIntersection.z
        );

        // if (this.hoveredObject !== intersected) {
        //   // Reset previously hovered object
        //   if (this.hoveredObject) {
        //     //this.hoveredObject.material.color.set(0xffffff);
        //     this.hoveredObject.material.uniforms.highLighterColor.value = {
        //       w: 1,
        //       x: 0.788,
        //       y: 0.325,
        //       z: 1,
        //     };
        //   }
        //   // Highlight the new object
        //   //intersected.material.color.set(0xff0000);
        //   intersected.material.uniforms.highLighterColor.value = {
        //     w: 1,
        //     x: 1,
        //     y: 0,
        //     z: 0,
        //   };
        //   this.hoveredObject = intersected;
        //   document.documentElement.style.cursor = "pointer";
        // }
      } else {
        // Reset the previously hovered object
        if (this.hoveredObject) {
          //this.hoveredObject.material.color.set(0xffffff);
          this.hoveredObject.material.uniforms.highLighterColor.value = {
            w: 1,
            x: 0.788,
            y: 0.325,
            z: 1,
          };
          this.hoveredObject = null;
        }
        document.documentElement.style.cursor = "default";
      }

    } else {
      document.documentElement.style.cursor = "default";
    }
  }

  // onHover(event) {

  //   if (this.panoSphere.highLighterParent) {
  //     const rect = this.canvas.getBoundingClientRect();
  //     this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  //     this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  //     this.raycaster.setFromCamera(this.pointer, this.camera);

  //     const highLighterChildren = this.panoSphere.highLighterParent.children;
  //     this.intersects = this.raycaster.intersectObjects(highLighterChildren);



  //     if (this.intersects.length > 0) {
  //       const intersected = this.intersects[0].object;

  //       if (this.hoveredObject !== intersected) {
  //         // Reset previously hovered object
  //         if (this.hoveredObject) {
  //           //this.hoveredObject.material.color.set(0xffffff);
  //           this.hoveredObject.material.uniforms.highLighterColor.value = {
  //             w: 1,
  //             x: 0.788,
  //             y: 0.325,
  //             z: 1,
  //           };
  //         }
  //         // Highlight the new object
  //         //intersected.material.color.set(0xff0000);
  //         intersected.material.uniforms.highLighterColor.value = {
  //           w: 1,
  //           x: 1,
  //           y: 0,
  //           z: 0,
  //         };
  //         this.hoveredObject = intersected;
  //         document.documentElement.style.cursor = "pointer";
  //       }
  //     } else {
  //       // Reset the previously hovered object
  //       if (this.hoveredObject) {
  //         //this.hoveredObject.material.color.set(0xffffff);
  //         this.hoveredObject.material.uniforms.highLighterColor.value = {
  //           w: 1,
  //           x: 0.788,
  //           y: 0.325,
  //           z: 1,
  //         };
  //         this.hoveredObject = null;
  //       }
  //       document.documentElement.style.cursor = "default";
  //     }

  //     // if(highLighterChildren == null){
  //     //   document.documentElement.style.cursor = "default";
  //     // }
  //   }else{
  //     document.documentElement.style.cursor = "default";
  //   }
  // }

  dispose() {
    // Remove the event listener to prevent memory leaks
    this.canvas.removeEventListener("click", this.handleClick);
  }
}

export default MyRaycaster;
