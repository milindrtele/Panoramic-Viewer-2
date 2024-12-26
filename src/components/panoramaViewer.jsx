import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//import { DragControls } from "three/addons/controls/DragControls.js";
//import { TransformControls } from "three/addons/controls/TransformControls.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import Hotspot from "../scripts/hotspot";
import Controls from "./controls";
import VideoPlayer from "./videoPlayer";
import Compass from "./compass";
import EnquiryForm from "./forms";
import "../index.css";

import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import PanoramicSphere from "../scripts/panoramicSphere";
import MyRaycaster from "../scripts/raycaster";

import { tweenCameraToNewPositionAndRotation } from "../scripts/tweenCameraToNewPosition";
import MatterPortViewer from "./matterportViewer";
import HamburgerMenu from "./hamburgerMenu";

import { NodeToyMaterial } from "@nodetoy/three-nodetoy";

function PanoramaViewer(props) {
  let buttonsToHide = document.getElementsByClassName("buttonsToHide");
  const loadingManager = new THREE.LoadingManager();
  const [landingAnimation, setLandingAnimation] = useState(true);
  const [loaderScreeVisible, setLoaderScreeVisible] = useState(true);
  const [percentageLoaded, setPercentageLoaded] = useState(null);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cssSceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);
  const css3dRendererRef = useRef(null);
  const inactivityTimeoutRef = useRef(null); // Ref to store the inactivity timeout
  const initialPinchDistanceRef = useRef(null);
  const project_logRef = useRef(null);
  const startAutoRotateAfterInactivityRef = useRef(null);
  const tweenGroupRef = useRef(new TWEEN.Group());
  const cameraGroupRef = useRef(new THREE.Group());
  const cameraGroupParentRef = useRef(new THREE.Group());

  const handleUserInteractionRef = useRef(null);
  const [showControls, setShowControls] = useState(false);

  const [currentPhi, setCurrentPhi] = useState(Math.PI / 2);
  const [currentTheta, setCurrentTheta] = useState(0);
  //const currentPhiRef = useRef(Math.PI / 2);
  //const currentThetaRef = useRef(0);

  const [showVideo, setShowVideo] = useState(false);
  const [videoSrcID, setVideoID] = useState(null);

  const [cameraFov, setCameraFov] = useState(null);

  const [isFormVisible, setisFormVisible] = useState(null);

  const raycasterRef = useRef(null);

  const highLightObjectArrayRef = useRef([]);
  const panoSphereRef = useRef(null);

  const [isMatterPortVisible, setIsMatterPortVisible] = useState(false);

  const panoDataRef = useRef(null);

  const isCameraAnimatingRef = useRef(false);

  useEffect(() => {
    project_logRef.current = document.getElementById("project_logo_container");
    // Scene setup
    sceneRef.current = new THREE.Scene();
    cssSceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      125,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current.position.set(0, 400, 100);
    //cameraRef.current.lookAt(new THREE.Vector3(0, 0, 1000));
    const pivotPoint = new THREE.Vector3(0, 0, 0);

    //cameraGroupRef.current.position.copy(pivotPoint);
    cameraGroupParentRef.current.position.copy(pivotPoint);
    cameraGroupRef.current.add(cameraRef.current);
    cameraGroupParentRef.current.add(cameraGroupRef.current);
    sceneRef.current.add(cameraGroupParentRef.current);

    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(rendererRef.current.domElement);

    // CSS3D Renderer
    css3dRendererRef.current = new CSS2DRenderer();
    css3dRendererRef.current.setSize(window.innerWidth, window.innerHeight);
    css3dRendererRef.current.domElement.style.position = "absolute";
    css3dRendererRef.current.domElement.style.top = 0;
    css3dRendererRef.current.domElement.style.pointerEvents = "none";
    css3dRendererRef.current.domElement.style.position = "fixed";
    document.body.appendChild(css3dRendererRef.current.domElement);

    //setup css3D scene Hotspots
    // const hotspot1 = new Hotspot(
    //   cssSceneRef.current,
    //   { x: 0, y: 0, z: -500 },
    //   "/innerHtml/child.html",
    //   "Location A"
    // );
    // const hotspot2 = new Hotspot(
    //   cssSceneRef.current,
    //   { x: 500, y: -100, z: -500 },
    //   "/innerHtml/child.html",
    //   "Location B"
    // );

    const ambientLight = new THREE.AmbientLight(0xffffff, 10);
    sceneRef.current.add(ambientLight);

    // const textureLoader = new THREE.TextureLoader();
    // const pano_image = textureLoader.load(
    //   "/pano_images/2294472375_24a3b8ef46_o.jpg"
    // );
    //pano_image.mapping = THREE.EquirectangularReflectionMapping;

    loadingManager.onProgress = (texture, loaded, total) => {
      setPercentageLoaded((loaded / total) * 100);
    };

    // async function findData(url, panoName) {
    //   try {
    //     const response = await fetch(url);
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! Status: ${response.status}`);
    //     }
    //     const data = await response.json();
    //     console.log(data);
    //     return data.find((item) => {
    //       console.log(item);
    //       return item.name == panoName;
    //     });
    //     // return data;
    //   } catch (error) {
    //     console.error("Failed to fetch data:", error);
    //     return [];
    //   }
    // }

    findData("/json/flat_panorama.json", "pano_0").then((panodata) => {
      setPercentageLoaded(0);
      panoDataRef.current = panodata;
      panoSphereRef.current.setPanoramaTexture(panodata.panoTextureUrlArray);
      panoSphereRef.current.setUpHotspots(panodata.hotSpotJsonUrl).then(() => {
        raycasterRef.current = new MyRaycaster(
          sceneRef.current,
          panoSphereRef.current,
          cameraRef.current,
          controlsRef.current,
          rendererRef.current.domElement,
          highLightObjectArrayRef.current,
          tweenGroupRef.current,
          startMatterPort,
        );
      });
      panoSphereRef.current.setUpTeleportPoints(panodata.teleportPointsUrl);
    });

    // const panodata = findData("/json/flat_panorama.json", "pano_0");
    // console.log(panodata);

    const currentPanoData = (panoSphereRef.current = new PanoramicSphere(
      sceneRef.current,
      cameraRef.current,
      controlsRef.current,
      cssSceneRef.current,
      loadingManager,
      videoEmbed,
      tweenGroupRef.current
    ));

    // Camera controls
    controlsRef.current = new OrbitControls(
      cameraRef.current,
      rendererRef.current.domElement
    );
    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 1;
    controlsRef.current.rotateSpeed = -0.25;
    controlsRef.current.enableZoom = false; // Disable zoom
    controlsRef.current.enablePan = false; // Disable pan
    //controlsRef.current.autoRotate = true;
    controlsRef.current.autoRotateSpeed = 0.3;

    // Resize handler
    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      rendererRef.current.setSize(innerWidth, innerHeight);
      css3dRendererRef.current.setSize(innerWidth, innerHeight);
      cameraRef.current.aspect = innerWidth / innerHeight;
      cameraRef.current.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Zoom in/out handlers
    const handleZoomIn = () => {
      cameraRef.current.fov -= 1.5; // Decrease the field of view
      setCameraFov(cameraRef.current.fov);
      cameraRef.current.updateProjectionMatrix();
    };

    const handleZoomOut = () => {
      cameraRef.current.fov += 1.5; // Increase the field of view
      setCameraFov(cameraRef.current.fov);
      cameraRef.current.updateProjectionMatrix();
    };

    window.addEventListener("wheel", function (event) {
      if (event.deltaY < 0 && cameraRef.current.fov >= 30) {
        handleZoomIn();
      } else if (event.deltaY > 0 && cameraRef.current.fov <= 90) {
        handleZoomOut();
      }
    });

    // Pinch to zoom handlers
    const handlePinchStart = (event) => {
      if (event.touches.length === 1) {
        controlsRef.current.enabled = true;
      } else if (event.touches.length === 2) {
        controlsRef.current.enabled = false;
        const dx = event.touches[0].pageX - event.touches[1].pageX;
        const dy = event.touches[0].pageY - event.touches[1].pageY;
        initialPinchDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handlePinchMove = (event) => {
      if (event.touches.length === 1) {
        controlsRef.current.enabled = true;
      } else if (
        event.touches.length === 2 &&
        initialPinchDistanceRef.current
      ) {
        const dx = event.touches[0].pageX - event.touches[1].pageX;
        const dy = event.touches[0].pageY - event.touches[1].pageY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        const zoomFactor =
          0.3 * (initialPinchDistanceRef.current - currentDistance);

        cameraRef.current.fov = Math.max(
          30,
          Math.min(90, cameraRef.current.fov + zoomFactor)
        );
        setCameraFov(cameraRef.current.fov);
        cameraRef.current.updateProjectionMatrix();

        initialPinchDistanceRef.current = currentDistance;
      }
    };

    window.addEventListener("touchstart", handlePinchStart, { passive: true });
    window.addEventListener("touchmove", handlePinchMove, { passive: true });

    // Function to stop auto-rotation on user interaction
    const stopAutoRotate = () => {
      controlsRef.current.autoRotate = false;
      clearTimeout(inactivityTimeoutRef.current);
    };

    // Function to start auto-rotation after 3 seconds of inactivity
    startAutoRotateAfterInactivityRef.current = () => {
      clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = setTimeout(() => {
        controlsRef.current.enabled = true;
        controlsRef.current.autoRotate = true;
      }, 8000); // 8 seconds
    };

    // Add event listeners to stop auto-rotation on user interaction
    handleUserInteractionRef.current = () => {
      stopAutoRotate();
      if(landingAnimation && !isCameraAnimatingRef.current && !panoSphereRef.current.isPanoramaAnimating.isAnimating){
        startAutoRotateAfterInactivityRef.current();
      }
    };

    rendererRef.current.domElement.addEventListener(
      "mousedown",
      handleUserInteractionRef.current
    );
    rendererRef.current.domElement.addEventListener(
      "touchstart",
      handleUserInteractionRef.current
    );
    rendererRef.current.domElement.addEventListener(
      "wheel",
      handleUserInteractionRef.current
    );

    function updatePhiAndTheta() {
      // if (controlsRef.current.autoRotate) {
      //currentPhiRef.current = controlsRef.current.getPolarAngle();
      setCurrentPhi(controlsRef.current.getPolarAngle());
      setCurrentTheta(controlsRef.current.getAzimuthalAngle());
      // }
    }

    // Animation loop
    const animate = () => {
      if (!isMatterPortVisible) {
        if(raycasterRef.current){
          isCameraAnimatingRef.current = raycasterRef.current.cameraAnimationState.isCameraAnimating;
        }
        //console.log(cameraGroupRef.current.rotation.y);
        // console.log(cameraRef.current.rotation.y);

        // if (sceneRef.current != null) raycasterRef.current.onHover();

        updatePhiAndTheta();
        requestAnimationFrame(animate);
        if (controlsRef.current.enabled) controlsRef.current.update();
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        css3dRendererRef.current.render(cssSceneRef.current, cameraRef.current);
        if (tweenGroupRef.current) tweenGroupRef.current.update();
        NodeToyMaterial.tick();
      }
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      rendererRef.current.domElement.removeEventListener(
        "mousedown",
        handleUserInteractionRef.current
      );
      rendererRef.current.domElement.removeEventListener(
        "touchstart",
        handleUserInteractionRef.current
      );
      rendererRef.current.domElement.removeEventListener(
        "wheel",
        handleUserInteractionRef.current
      );
      mountRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    };
  }, []);

  async function findData(url, panoName) {
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

  useEffect(() => {
    startAutoRotateAfterInactivityRef.current();
  }, []);

  useEffect(() => {
    if (landingAnimation && percentageLoaded >= 100) {
      // tweenGroupRef.current = new TWEEN.Group(); // Create a new group for managing tweens

      let pos = { x: 0, y: 400, z: 100 };
      const positionTween = new TWEEN.Tween(pos, tweenGroupRef.current)
        .to({ x: 0, y: 0.35, z: 1 }, 5000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onStart(()=>{
          isCameraAnimatingRef.current = true;
        })
        .onUpdate(() => {
          cameraRef.current.position.set(pos.x, pos.y, pos.z);
        })
        .onComplete(() => {
          //console.log("abc");
        });

      const fovTween = new TWEEN.Tween(
        { fov: cameraRef.current.fov },
        tweenGroupRef.current
      )
        .to({ fov: 60 }, 5000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate((object) => {
          cameraRef.current.fov = object.fov;
          setCameraFov(cameraRef.current.fov);
          cameraRef.current.updateProjectionMatrix();
        })
        .onComplete(() => {
          //console.log("def");
        });

      let target = { x: 0, y: 0, z: 0 };
      const cameraTargetTween1 = new TWEEN.Tween(target, tweenGroupRef.current)
        .to({ x: 0, y: 0, z: -100 }, 2700)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(() => {
          if (controlsRef.current) {
            controlsRef.current.target.set(target.x, target.y, target.z);
            controlsRef.current.update(); // Update the controls to reflect new target position
          }
          //console.log(target); // Log to see if target values are updating
        })
        .onComplete(() => {
          //console.log("Target animation complete");
          controlsRef.current.target.set(0, 0, 0);

          //addHotSpots();
        });
      let target2 = { x: 0, y: 0, z: -100 };
      const cameraTargetTween2 = new TWEEN.Tween(target2, tweenGroupRef.current)
        .to({ x: 0, y: 0, z: 0 }, 2300)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(() => {
          if (controlsRef.current) {
            controlsRef.current.target.set(target2.x, target2.y, target2.z);
            controlsRef.current.update(); // Update the controls to reflect new target position
          }
          //console.log(target2); // Log to see if target values are updating
        })
        .onComplete(() => {
          isCameraAnimatingRef.current = false;
          setLandingAnimation(false);
          //console.log("Target animation complete");
          controlsRef.current.target.set(0, 0, 0);
          //addHotSpots();
          setShowControls(true);
          highLightObjectArrayRef.current.forEach((object) => {
            sceneRef.current.add(object);
          });
          console.log(panoSphereRef.current.hotspotInstances);
          panoSphereRef.current.hotspotInstances.forEach((hotspot) => {
            console.log(hotspot);
            hotspot.addToScene();
          });
          // panoSphereRef.current.setUpHighLighters(
          //   "models/new_highlighters/pano_01_highLighters/pano_01_highLighters_02.glb"
          // );
          // panoSphereRef.current.setUpHighLighters(
          //   panoDataRef.current.highLighterJsonUrl
          // );
        });

      setTimeout(() => {
        positionTween.start();
        fovTween.start();
        cameraTargetTween1.chain(cameraTargetTween2);
        cameraTargetTween1.start();
        //cameraTargetTween2.start();
      }, 1000);
    }
  }, [percentageLoaded]);

  useEffect(() => {
    console.log(percentageLoaded + "%");
    if (percentageLoaded == 100) {
      setLoaderScreeVisible(false);
      project_logRef.current.classList.add("logo_position_left");
    }
  }, [percentageLoaded]);

  const videoEmbed = (id) => {
    console.log("entered the callback function");
    setVideoID(id); //"esWJ3uXxZaY"
    setShowVideo(true);
  };

  const zoomIn = () => {
    handleUserInteractionRef.current();
    if (cameraRef.current && cameraRef.current.fov >= 30) {
      let targetFov = cameraRef.current.fov - 10;

      const fovTweenButton = new TWEEN.Tween(
        { fov: cameraRef.current.fov },
        tweenGroupRef.current
      )
        .to({ fov: targetFov }, 500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate((object) => {
          cameraRef.current.fov = object.fov;
          setCameraFov(cameraRef.current.fov);
          cameraRef.current.updateProjectionMatrix();
        })
        .onComplete(() => {
          //console.log("def");
        });

      fovTweenButton.start();
    }
  };

  const zoomOut = () => {
    if (cameraRef.current && cameraRef.current.fov <= 90) {
      handleUserInteractionRef.current();
      let targetFov = cameraRef.current.fov + 10;

      const fovTweenButton = new TWEEN.Tween(
        { fov: cameraRef.current.fov },
        tweenGroupRef.current
      )
        .to({ fov: targetFov }, 500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate((object) => {
          cameraRef.current.fov = object.fov;
          setCameraFov(cameraRef.current.fov);
          cameraRef.current.updateProjectionMatrix();
        })
        .onComplete(() => {
          //console.log("def");
        });

      fovTweenButton.start();
    }
  };

  // Rotation increment in radians (10 degrees)
  const increment = THREE.MathUtils.degToRad(10);

  const rotateUp = () => {
    if (cameraRef.current) {
      handleUserInteractionRef.current();
      let targetRotation = currentPhi + increment;

      const rotateTween = new TWEEN.Tween(
        { rotationX: currentPhi },
        tweenGroupRef.current
      )
        .to({ rotationX: targetRotation }, 500)
        .onUpdate((object) => {
          position_camera(controlsRef.current, object.rotationX, currentTheta);
          //currentPhiRef.current = object.rotationX; // Update currentPhiRef.current
          setCurrentPhi(object.rotationX);
        })
        .onComplete(() => {
          //currentPhiRef.current = targetRotation;
          setCurrentPhi(targetRotation);
        });

      rotateTween.start();
    }
  };

  const rotateDown = () => {
    if (cameraRef.current) {
      handleUserInteractionRef.current();
      let targetRotation = currentPhi - increment;

      const rotateTween = new TWEEN.Tween(
        { rotationX: currentPhi },
        tweenGroupRef.current
      )
        .to({ rotationX: targetRotation }, 500)
        .onUpdate((object) => {
          position_camera(controlsRef.current, object.rotationX, currentTheta);
          setCurrentPhi(object.rotationX); // Update currentPhiRef.current
        })
        .onComplete(() => {
          //currentPhiRef.current = targetRotation;
          setCurrentPhi(targetRotation);
        });

      rotateTween.start();
    }
  };

  const rotateLeft = () => {
    if (cameraRef.current) {
      handleUserInteractionRef.current();
      let targetRotation = currentTheta + increment;

      const rotateTween = new TWEEN.Tween(
        { rotationY: currentTheta },
        tweenGroupRef.current
      )
        .to({ rotationY: targetRotation }, 500)
        .onStart(() => {
          //console.log(currentPhi);
        })
        .onUpdate((object) => {
          position_camera(controlsRef.current, currentPhi, object.rotationY);
          setCurrentTheta(object.rotationY); // Update currentTheta
        })
        .onComplete(() => {
          setCurrentTheta(targetRotation);
          //console.log(currentTheta);
        });

      rotateTween.start();
    }
  };

  const rotateRight = () => {
    if (cameraRef.current) {
      handleUserInteractionRef.current();
      let targetRotation = currentTheta - increment;

      const rotateTween = new TWEEN.Tween(
        { rotationY: currentTheta },
        tweenGroupRef.current
      )
        .to({ rotationY: targetRotation }, 500)
        .onUpdate((object) => {
          position_camera(controlsRef.current, currentPhi, object.rotationY);
          setCurrentTheta(object.rotationY); // Update currentThetaRef.current
        })
        .onComplete(() => {
          setCurrentTheta(targetRotation);
        });

      rotateTween.start();
    }
  };

  // Adjust the camera position based on spherical coordinates
  function position_camera(controls, phi, theta) {
    const spherical_position = new THREE.Spherical(1, phi, theta);
    const position = new THREE.Vector3().setFromSpherical(spherical_position);
    cameraRef.current.position.set(position.x, position.y, position.z);
  }

  const pauseAutorotation = () => {
    controlsRef.current.autoRotate = !controlsRef.current.autoRotate;
  };

  const hideIcons = () => {
    //console.log(buttonsToHide);
    for (let button of buttonsToHide) {
      if (button.style.display == "") {
        //console.log(button.style);
        button.style.display = "none";
        panoSphereRef.current.hideHotspots();
        panoSphereRef.current.hideHighLighters();
      } else {
        //console.log(button.style);
        button.style.display = "";
        panoSphereRef.current.showHotspots();
        panoSphereRef.current.showHighLighters();
      }
    }
  };

  useEffect(() => {
    console.log("show video: " + showVideo);
  }, [showVideo]);

  const clickedOutsideOfVideo = () => {
    console.log("clicked outside of video");
    setShowVideo(false);
  };

  const handleClickedOutsideForm = () => {
    setisFormVisible(false);
  };

  const startMatterPort = () => {
    setIsMatterPortVisible(true);
  };

  const closeMatterPort = () => {
    setIsMatterPortVisible(false);
  };

  const menuSelectedInHamburger = (itemName) => {
    handleUserInteractionRef.current();
    switch (itemName) {
      case "exterior":
        setPercentageLoaded(0);
        findData("/json/flat_panorama.json", "pano_0").then((panodata) => {
          panoDataRef.current = panodata;
          panoSphereRef.current.setPanoramaTexture(panodata.panoTextureUrlArray);
          panoSphereRef.current.setUpHotspots(panodata.hotSpotJsonUrl).then(() => {
            panoSphereRef.current.hotspotInstances.forEach((hotspot) => {
              console.log(hotspot);
              hotspot.addToScene();
            });
            panoSphereRef.current.setUpTeleportPoints(panodata.teleportPointsUrl)
            // panoSphereRef.current.setUpHighLighters(
            //   panodata.highLighterJsonUrl
            // );
          });
        });
        break;
      case "interior_1":
        setPercentageLoaded(0);
        findData("/json/flat_panorama.json", "pano_1").then((panodata) => {
          panoDataRef.current = panodata;
          panoSphereRef.current.setPanoramaTexture(panodata.panoTextureUrlArray);
          panoSphereRef.current.setUpHotspots(panodata.hotSpotJsonUrl).then(() => {
            panoSphereRef.current.hotspotInstances.forEach((hotspot) => {
              console.log(hotspot);
              hotspot.addToScene();
            });
            // panoSphereRef.current.setUpHighLighters(
            //   panodata.highLighterJsonUrl
            // );
          });
        });
        break;
      case "interior_2":
        setPercentageLoaded(0);
        findData("/json/flat_panorama.json", "pano_2").then((panodata) => {
          panoDataRef.current = panodata;
          panoSphereRef.current.setPanoramaTexture(panodata.panoTextureUrlArray);
          panoSphereRef.current.setUpHotspots(panodata.hotSpotJsonUrl).then(() => {
            panoSphereRef.current.hotspotInstances.forEach((hotspot) => {
              console.log(hotspot);
              hotspot.addToScene();
            });
            // panoSphereRef.current.setUpHighLighters(
            //   panodata.highLighterJsonUrl
            // );
          });
        });
        break;
      case "interior_3":
        startMatterPort();
        break;
      case "contact_us":
        window.open(
          "https://docs.google.com/forms/d/e/1FAIpQLSfy4jItS6zNTWVvYDnfqUNb1vGEN_yksisKrNz1ijgM-tOotQ/viewform",
          "_blank"
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className="parent_container">
      {loaderScreeVisible ? <div className="loader_screen"></div> : null}
      {percentageLoaded != 100 ? (
        <progress id="progress-bar-pano" max="100" value={percentageLoaded}>
          {percentageLoaded}
        </progress>
      ) : null}

      <div id="project_logo_container" className="project_logo_container">
        <div id="project_logo" className="project_logo"></div>
        <div className="title_container">
          <div className="title_bar_top">
            <div className="h_bar"></div>
            <div className="thane">
              <p>Logo</p>
            </div>
            <div className="h_bar"></div>
          </div>
          <div className="titlebar_bottom">
            <p>Ipsum</p>
          </div>
        </div>
      </div>
      <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />
      {showControls ? (
        <>
          <div className="controls_container">
            <div className="controls_tab">
              <button
                className="controls_button buttonsToHide"
                onClick={zoomIn}
              >
                <span className="tooltiptext">Zoom In</span>
                <div className="control_button_icon zoom_in_icon"></div>
              </button>
              <button
                className="controls_button buttonsToHide"
                onClick={zoomOut}
              >
                <span className="tooltiptext">Zoom Out</span>
                <div className="control_button_icon zoom_out_icon"></div>
              </button>
              <button
                className="controls_button buttonsToHide"
                onClick={rotateLeft}
              >
                <span className="tooltiptext">Rotate Left</span>
                <div className="control_button_icon rotate_left_icon"></div>
              </button>
              <button
                className="controls_button buttonsToHide"
                onClick={rotateRight}
              >
                <span className="tooltiptext">Rotate Right</span>
                <div className="control_button_icon rotate_right_icon"></div>
              </button>
              <button
                className="controls_button buttonsToHide"
                onClick={rotateUp}
              >
                <span className="tooltiptext">Rotate Up</span>
                <div className="control_button_icon rotate_up_icon"></div>
              </button>
              <button
                className="controls_button buttonsToHide"
                onClick={rotateDown}
              >
                <span className="tooltiptext">Rotate Down</span>
                <div className="control_button_icon rotate_down_icon"></div>
              </button>
              <button
                className="controls_button buttonsToHide"
                onClick={pauseAutorotation}
              >
                <span className="tooltiptext">Toggle Autorotate</span>
                <div className="control_button_icon auto_rotate_icon"></div>
              </button>
              <button className="controls_button" onClick={hideIcons}>
                <span className="tooltiptext">Toggle Icons Visibility</span>
                <div className="control_button_icon hide_icons"></div>
              </button>
            </div>
            {/* <div
              className="enquiry_button"
              onClick={() => {
                setisFormVisible(true);
              }}
            >
              <p>ENQUIRE NOW</p>
            </div> */}
            {/* <a
              href="https://api.whatsapp.com/send?phone=9423125978&text=Hello, I want to Enquire about Panorama Viewer"
              target="_blank"
            >
              <div className="whatsapp_button"></div>
            </a> */}
          </div>
          {/* <a href="https://metavian.tech/">
            <div className="powered_by_metavian">
              <p>Powered by Metavian</p>
            </div>
          </a> */}
          {/* <HamburgerMenu menuItem={menuSelectedInHamburger} /> */}
        </>
      ) : // <Controls
      //   camera={cameraRef.current}
      //   cameraGroupParent={cameraGroupParentRef.current}
      //   cameraGroup={cameraGroupRef.current}
      //   controls={controlsRef.current}
      //   tweenGroup={tweenGroupRef.current}
      //   handleUserInteractionProp={handleUserInteractionRef.current}
      //   phi={currentPhi}
      //   theta={currentTheta}
      // />
      null}
      {/* <div className="preview">Preview Copy</div> */}
      {showVideo ? (
        <VideoPlayer
          videoSrcID={videoSrcID} //"https://www.youtube.com/embed/ZLq_hIlmGos?autoplay=1"
          clickedOutside={clickedOutsideOfVideo}
        />
      ) : null}
      {/* tgbNymZ7vqY */}
      {showControls ? <Compass fov={cameraFov} angle={currentTheta} /> : null}
      {/* {isFormVisible ? (
        <EnquiryForm
          clickedOutsideForm={handleClickedOutsideForm}
          closeForm={handleClickedOutsideForm}
        />
      ) : null} */}
      {isMatterPortVisible ? (
        <MatterPortViewer closeClicked={closeMatterPort} />
      ) : null}
    </div>
  );
}

export default PanoramaViewer;
