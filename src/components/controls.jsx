import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

import EnquiryForm from "./forms";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Controls = (props) => {
  let buttonsToHide = document.getElementsByClassName("buttonsToHide");
  let currentCamera = props.camera;
  // let currentCameraGroup = props.cameraGroup;
  let currentTweenGroup = props.tweenGroup;
  // let currentCameraGroupParent = props.cameraGroupParent;
  // let currentPhi = props.phi;
  // let currentTheta = props.theta;
  let currentPhi = Math.PI / 2;
  let currentTheta = 0;
  // Define the control functions here
  const zoomIn = () => {
    props.handleUserInteractionProp();
    if (currentCamera && currentCamera.fov >= 30) {
      let targetFov = currentCamera.fov - 10;

      const fovTweenButton = new TWEEN.Tween(
        { fov: currentCamera.fov },
        currentTweenGroup
      )
        .to({ fov: targetFov }, 500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate((object) => {
          currentCamera.fov = object.fov;
          currentCamera.updateProjectionMatrix();
        })
        .onComplete(() => {
          //console.log("def");
        });

      fovTweenButton.start();
    }
  };

  const zoomOut = () => {
    if (currentCamera && currentCamera.fov <= 90) {
      props.handleUserInteractionProp();
      let targetFov = currentCamera.fov + 10;

      const fovTweenButton = new TWEEN.Tween(
        { fov: currentCamera.fov },
        currentTweenGroup
      )
        .to({ fov: targetFov }, 500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate((object) => {
          currentCamera.fov = object.fov;
          currentCamera.updateProjectionMatrix();
        })
        .onComplete(() => {
          //console.log("def");
        });

      fovTweenButton.start();
    }
  };

  // const rotationAxis = new THREE.Vector3(0, 1, 0); // Y-axis
  // const rotationAngle = THREE.MathUtils.degToRad(10); // Convert 10 degrees to radians

  // Create a quaternion representing the 10-degree rotation around the Y-axis

  // Function to rotate the object using the quaternion
  function rotateCameraGroup(axis, rotationAxis, rotationAngle) {
    props.handleUserInteractionProp();
    const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(
      rotationAxis,
      rotationAngle
    );

    if (axis == "x") {
      // Multiply the object's current quaternion by the rotation quaternion
      currentCameraGroupParent.quaternion.multiplyQuaternions(
        rotationQuaternion,
        currentCameraGroup.quaternion
      );
    } else if (axis == "y") {
      // Multiply the object's current quaternion by the rotation quaternion
      currentCameraGroup.quaternion.multiplyQuaternions(
        rotationQuaternion,
        currentCameraGroup.quaternion
      );
    }
  }

  // Rotation increment in radians (10 degrees)
  const increment = THREE.MathUtils.degToRad(10);

  const rotateUp = () => {
    if (currentCamera) {
      props.handleUserInteractionProp();
      let targetRotation = currentPhi + increment;

      const rotateTween = new TWEEN.Tween(
        { rotationX: currentPhi },
        currentTweenGroup
      )
        .to({ rotationX: targetRotation }, 500)
        .onUpdate((object) => {
          position_camera(props.controls, object.rotationX, currentTheta);
          currentPhi = object.rotationX; // Update currentPhi
        })
        .onComplete(() => {
          currentPhi = targetRotation;
        });

      rotateTween.start();
    }
  };

  const rotateDown = () => {
    if (currentCamera) {
      props.handleUserInteractionProp();
      let targetRotation = currentPhi - increment;

      const rotateTween = new TWEEN.Tween(
        { rotationX: currentPhi },
        currentTweenGroup
      )
        .to({ rotationX: targetRotation }, 500)
        .onUpdate((object) => {
          position_camera(props.controls, object.rotationX, currentTheta);
          currentPhi = object.rotationX; // Update currentPhi
        })
        .onComplete(() => {
          currentPhi = targetRotation;
        });

      rotateTween.start();
    }
  };

  const rotateLeft = () => {
    if (currentCamera) {
      props.handleUserInteractionProp();
      let targetRotation = currentTheta + increment;

      const rotateTween = new TWEEN.Tween(
        { rotationY: currentTheta },
        currentTweenGroup
      )
        .to({ rotationY: targetRotation }, 500)
        .onUpdate((object) => {
          position_camera(props.controls, currentPhi, object.rotationY);
          currentTheta = object.rotationY; // Update currentTheta
        })
        .onComplete(() => {
          currentTheta = targetRotation;
        });

      rotateTween.start();
    }
  };

  const rotateRight = () => {
    if (currentCamera) {
      props.handleUserInteractionProp();
      let targetRotation = currentTheta - increment;

      const rotateTween = new TWEEN.Tween(
        { rotationY: currentTheta },
        currentTweenGroup
      )
        .to({ rotationY: targetRotation }, 500)
        .onUpdate((object) => {
          position_camera(props.controls, currentPhi, object.rotationY);
          currentTheta = object.rotationY; // Update currentTheta
        })
        .onComplete(() => {
          currentTheta = targetRotation;
        });

      rotateTween.start();
    }
  };

  // Adjust the camera position based on spherical coordinates
  function position_camera(controls, phi, theta) {
    const spherical_position = new THREE.Spherical(1, phi, theta);
    const position = new THREE.Vector3().setFromSpherical(spherical_position);
    currentCamera.position.set(position.x, position.y, position.z);
  }

  // var currentPhi = Math.PI / 2;
  // var currentTheta = 0;

  // function position_camera(controls, phi, theta) {
  //   console.log(theta);
  //   var spherical_position = new THREE.Spherical(1, phi, theta);
  //   var position = new THREE.Vector3().setFromSpherical(spherical_position);
  //   currentCamera.position.set(position.x, position.y, position.z);
  //   console.log(position);
  //   controls.update();
  //   controls.saveState();
  // }

  // const rotateLeft = () => {
  //   // const rotationAxis = new THREE.Vector3(0, 1, 0); // Y-axis
  //   // const rotationAngle = THREE.MathUtils.degToRad(10);
  //   // rotateCameraGroup("y", rotationAxis, rotationAngle);
  //   ///////////////////////////////////////////////////////////////////////
  //   // if (currentCameraGroup) {
  //   //   props.handleUserInteractionProp();
  //   //   // Target rotation is 10 degrees (in radians) from the current rotation
  //   //   const increment = (Math.PI / 180) * 10;
  //   //   let targetRotation = currentCameraGroup.rotation.y + increment;
  //   //   const rotateTween = new TWEEN.Tween(
  //   //     { rotationY: currentCameraGroup.rotation.y },
  //   //     currentTweenGroup
  //   //   )
  //   //     .to({ rotationY: targetRotation }, 500)
  //   //     .onStart((object) => {
  //   //       console.log(object.rotationY);
  //   //       props.controls.enabled = false; //disable orbitControls
  //   //     })
  //   //     .onUpdate((object) => {
  //   //       currentCameraGroup.rotation.y = object.rotationY;
  //   //     })
  //   //     .onComplete(() => {
  //   //       //props.controls.reset(); //reset orbitControls
  //   //       props.controls.enabled = true; //enable orbitControl again
  //   //     });
  //   //   rotateTween.start();
  //   // }
  //   ///////////////////////////////////////////////////////////////////////
  //   if (currentCamera) {
  //     let newCameraPosition = currentCamera.position;
  //     props.handleUserInteractionProp();
  //     // Target rotation is 10 degrees from the current rotation
  //     const increment = (Math.PI / 180) * 10;
  //     let targetRotation = currentCamera.rotation.y + increment;
  //     const rotateTween = new TWEEN.Tween(
  //       { rotationY: currentCamera.rotation.y },
  //       currentTweenGroup
  //     )
  //       .to({ rotationY: targetRotation }, 500)
  //       .onStart((object) => {
  //         //props.controls.saveState();
  //         //props.controls.enabled = false; //disable orbitControls
  //       })
  //       .onUpdate((object) => {
  //         //currentCamera.rotation.y = object.rotationY;
  //         position_camera(props.controls, currentPhi, object.rotationY);
  //         currentTheta = object.rotationY;
  //       })
  //       .onComplete(() => {
  //         //get new camera position
  //         //props.controls.reset(); //reset orbitControls
  //         //props.controls.update();
  //         //props.controls.enabled = true; //enable orbitControl again
  //       });
  //     rotateTween.start();
  //   }
  // };

  // const rotateRight = () => {
  //   // const rotationAxis = new THREE.Vector3(0, 1, 0); // Y-axis
  //   // const rotationAngle = THREE.MathUtils.degToRad(-10);
  //   // rotateCameraGroup("y", rotationAxis, rotationAngle);
  //   if (currentCameraGroup) {
  //     props.handleUserInteractionProp();

  //     // Target rotation is 10 degrees (in radians) from the current rotation
  //     const increment = (Math.PI / 180) * 10;

  //     let targetRotation = currentCameraGroup.rotation.y - increment;

  //     const rotateTween = new TWEEN.Tween(
  //       { rotationY: currentCameraGroup.rotation.y },
  //       currentTweenGroup
  //     )
  //       .to({ rotationY: targetRotation }, 500)
  //       .onStart((object) => {
  //         console.log(object.rotationY);
  //       })
  //       .onUpdate((object) => {
  //         currentCameraGroup.rotation.y = object.rotationY;
  //       })
  //       .onComplete(() => {});

  //     rotateTween.start();
  //   }
  // };

  // const rotateUp = () => {
  //   // const rotationAxis = new THREE.Vector3(1, 0, 0); // X-axis
  //   // const rotationAngle = THREE.MathUtils.degToRad(10);
  //   // rotateCameraGroup("x", rotationAxis, rotationAngle);
  //   // if (currentCameraGroup) {
  //   //   props.handleUserInteractionProp();
  //   //   // Target rotation is 10 degrees (in radians) from the current rotation
  //   //   const increment = (Math.PI / 180) * 10;
  //   //   let targetRotation = currentCameraGroup.rotation.x + increment;
  //   //   const rotateTween = new TWEEN.Tween(
  //   //     { rotationX: currentCameraGroup.rotation.x },
  //   //     currentTweenGroup
  //   //   )
  //   //     .to({ rotationX: targetRotation }, 500)
  //   //     .onStart((object) => {})
  //   //     .onUpdate((object) => {
  //   //       currentCameraGroup.rotation.x = object.rotationX;
  //   //     })
  //   //     .onComplete(() => {});
  //   //   rotateTween.start();
  //   // }
  //   ////////////////////////////////////////////////////////////////////////
  //   if (currentCamera) {
  //     let newCameraPosition = currentCamera.position;
  //     props.handleUserInteractionProp();
  //     // Target rotation is 10 degrees from the current rotation
  //     const increment = (Math.PI / 180) * 10;
  //     let targetRotation = currentCamera.rotation.x + increment;
  //     const rotateTween = new TWEEN.Tween(
  //       { rotationX: currentCamera.rotation.x },
  //       currentTweenGroup
  //     )
  //       .to({ rotationX: targetRotation }, 500)
  //       .onStart((object) => {
  //         //props.controls.saveState();
  //         //props.controls.enabled = false; //disable orbitControls
  //       })
  //       .onUpdate((object) => {
  //         //currentCamera.rotation.y = object.rotationY;
  //         position_camera(props.controls, object.rotationX, currentTheta);
  //         currentPhi = object.rotationX;
  //       })
  //       .onComplete(() => {
  //         //get new camera position
  //         //props.controls.reset(); //reset orbitControls
  //         //props.controls.update();
  //         //props.controls.enabled = true; //enable orbitControl again
  //       });
  //     rotateTween.start();
  //   }
  // };

  // const rotateUp = () => {
  //   if (currentCamera) {
  //     props.handleUserInteractionProp();

  //     // Target rotation is 10 degrees (in radians) added to the current `currentPhi`
  //     const increment = THREE.MathUtils.degToRad(10); // Increment of 10 degrees
  //     let targetRotation = currentPhi + increment; // Incrementally update `currentPhi`

  //     const rotateTween = new TWEEN.Tween(
  //       { rotationX: currentPhi }, // Start from `currentPhi`
  //       currentTweenGroup
  //     )
  //       .to({ rotationX: targetRotation }, 500)
  //       .onUpdate((object) => {
  //         position_camera(props.controls, object.rotationX, currentTheta);
  //         currentPhi = object.rotationX; // Update `currentPhi` during each step
  //       })
  //       .onComplete(() => {
  //         currentPhi = targetRotation; // Set `currentPhi` to the final rotation
  //       });

  //     rotateTween.start();
  //   }
  // };

  // const rotateDown = () => {
  //   // const rotationAxis = new THREE.Vector3(1, 0, 0); // X-axis
  //   // const rotationAngle = THREE.MathUtils.degToRad(-10);
  //   // rotateCameraGroup("x", rotationAxis, rotationAngle);
  //   if (currentCameraGroup) {
  //     props.handleUserInteractionProp();
  //     // Target rotation is 10 degrees (in radians) from the current rotation
  //     const increment = (Math.PI / 180) * 10;
  //     let targetRotation = currentCameraGroup.rotation.x - increment;
  //     const rotateTween = new TWEEN.Tween(
  //       { rotationX: currentCameraGroup.rotation.x },
  //       currentTweenGroup
  //     )
  //       .to({ rotationX: targetRotation }, 500)
  //       .onStart((object) => {})
  //       .onUpdate((object) => {
  //         currentCameraGroup.rotation.x = object.rotationX;
  //       })
  //       .onComplete(() => {});
  //     rotateTween.start();
  //   }
  // };

  const switchCameraMode = () => {
    if (currentCamera) {
      // Switch between perspective and orthographic or toggle settings
      currentCamera.isPerspectiveCamera = !currentCamera.isPerspectiveCamera;
      currentCamera.updateProjectionMatrix();
    }
  };

  const pauseAutorotation = () => {
    props.controls.autoRotate = !props.controls.autoRotate;
  };

  const hideIcons = () => {
    console.log(buttonsToHide);
    for (let button of buttonsToHide) {
      if (button.style.display == "") {
        console.log(button.style);
        button.style.display = "none";
      } else {
        console.log(button.style);
        button.style.display = "";
      }
    }
  };

  return (
    <div className="controls_container">
      <div className="controls_tab">
        <button className="controls_button buttonsToHide" onClick={zoomIn}>
          <div className="control_button_icon zoom_in_icon"></div>
        </button>
        <button className="controls_button buttonsToHide" onClick={zoomOut}>
          <div className="control_button_icon zoom_out_icon"></div>
        </button>
        <button className="controls_button buttonsToHide" onClick={rotateLeft}>
          <div className="control_button_icon rotate_left_icon"></div>
        </button>
        <button className="controls_button buttonsToHide" onClick={rotateRight}>
          <div className="control_button_icon rotate_right_icon"></div>
        </button>
        <button className="controls_button buttonsToHide" onClick={rotateUp}>
          <div className="control_button_icon rotate_up_icon"></div>
        </button>
        <button className="controls_button buttonsToHide" onClick={rotateDown}>
          <div className="control_button_icon rotate_down_icon"></div>
        </button>
        <button
          className="controls_button buttonsToHide"
          onClick={pauseAutorotation}
        >
          <div className="control_button_icon auto_rotate_icon"></div>
        </button>
        <button className="controls_button" onClick={hideIcons}>
          <div className="control_button_icon hide_icons"></div>
        </button>
      </div>
      <div className="enquiry_button">
        <p>ENQUIRE NOW</p>
      </div>
      <div className="whatsapp_button"></div>

      {isFormVisible ? <EnquiryForm /> : null}
    </div>
  );
};

export default Controls;
