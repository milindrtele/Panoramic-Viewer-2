import * as THREE from "three";
// import { gsap } from "gsap";
import TWEEN from "@tweenjs/tween.js";

const tweenCameraToNewPositionAndRotation = (
  camera,
  controls,
  currentCameraTarget,
  cameraTarget,
  newPosition,
  newRotation,
  tweenGroup,
  state // Pass a state object
) => {
  return new Promise((resolve, reject) => {
    let animationCompletionArray = [];

    function addToAnimationArray() {
      animationCompletionArray.push(true);
    }

    function checkAllAnimationsCompleted() {
      if (newRotation == null) {
        if (animationCompletionArray.length === 3) {
          resolve(state.isCameraAnimating); // Return the updated value
        }
      } else {
        if (animationCompletionArray.length === 4) {
          resolve(state.isCameraAnimating); // Return the updated value
        }
      }
    }

    let target = { ...currentCameraTarget };
    const cameraTargetTweenIn = new TWEEN.Tween(target, tweenGroup)
      .to({ ...cameraTarget }, 1250)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onStart(() => {
        state.isCameraAnimating = true; // Update the state
      })
      .onUpdate(() => {
        if (controls) {
          controls.target.set(target.x, target.y, target.z);
          controls.update();
        }
      })
      .onComplete(() => {
        addToAnimationArray();
        checkAllAnimationsCompleted();
      });

    const cameraTargetTweenOut = new TWEEN.Tween(target, tweenGroup)
      .to({ x: 0, y: 0, z: 0 }, 1250)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(() => {
        if (controls) {
          controls.target.set(target.x, target.y, target.z);
          controls.update();
        }
      })
      .onComplete(() => {
        state.isCameraAnimating = false; // Update the state
        addToAnimationArray();
        checkAllAnimationsCompleted();
      });

    const fovObject = { fov: camera.fov };
    const endFov = 25;

    const fovTweenIn = new TWEEN.Tween(fovObject, tweenGroup)
      .to({ fov: endFov }, 1250)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(() => {
        camera.fov = fovObject.fov; // Update the camera's fov
        camera.updateProjectionMatrix(); // Important: Update the projection matrix after changing fov
      })
      .onComplete(() => {
        addToAnimationArray();
        checkAllAnimationsCompleted();
      });

    const fovTweenOut = new TWEEN.Tween(fovObject, tweenGroup)
      .to({ fov: 50 }, 1250)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(() => {
        camera.fov = fovObject.fov; // Update the camera's fov
        camera.updateProjectionMatrix(); // Important: Update the projection matrix after changing fov
      })
      .onComplete(() => {
        addToAnimationArray();
        checkAllAnimationsCompleted();
      });

    cameraTargetTweenIn.chain(cameraTargetTweenOut);
    cameraTargetTweenIn.start();
    fovTweenIn.chain(fovTweenOut);
    fovTweenIn.start();
  });
};

// const tweenCameraToNewPositionAndRotation = (
//   camera,
//   controls,
//   currentCameraTarget,
//   cameraTarget,
//   newPosition,
//   newRotation,
//   tweenGroup,
//   isCameraAnimating
// ) => {
//   // const tweenTarget = gsap.to(controls.target, {
//   //   ...cameraTarget,
//   //   duration: 1,
//   //   onUpdate: () => {},
//   // });
//   return new Promise((resolve, reject) => {
//     //console.log("entered animation");
//     let animationCompletionArray = [];

//     function addToAnimationArray() {
//       animationCompletionArray.push(true);
//     }

//     function checkAllAnimationsCompleted() {
//       if (newRotation == null) {
//         if (animationCompletionArray.length == 3) {
//           resolve();
//         }
//       } else {
//         if (animationCompletionArray.length == 4) {
//           resolve();
//         }
//       }
//     }

//     // let target = { ...currentCameraTarget };
//     // gsap.to(target, {
//     //   ...cameraTarget,
//     //   duration: 1,
//     //   onUpdate: () => {
//     //     camera.lookAt(target.x, target.y, target.z);
//     //   },
//     //   onComlete: () => {
//     //     addToAnimationArray();
//     //     checkAllAnimationsCompleted();
//     //   },
//     // });
//     let target = { ...currentCameraTarget };
//     const cameraTargetTweenIn = new TWEEN.Tween(target, tweenGroup)
//       .to({ ...cameraTarget }, 1250)
//       .easing(TWEEN.Easing.Cubic.InOut)
//       .onStart(()=>{
//         isCameraAnimating = true;
//       })
//       .onUpdate(() => {
//         if (controls) {
//           controls.target.set(target.x, target.y, target.z);
//           controls.update(); // Update the controls to reflect new target position
//         }
//         //console.log(target); // Log to see if target values are updating
//       })
//       .onComplete(() => {
//         //console.log("Target animation complete");
//         addToAnimationArray();
//         checkAllAnimationsCompleted();
//         //addHotSpots();
//       });
//     const cameraTargetTweenOut = new TWEEN.Tween(target, tweenGroup)
//       .to({ x: 0, y: 0, z: 0 }, 1250)
//       .easing(TWEEN.Easing.Cubic.InOut)
//       .onUpdate(() => {
//         if (controls) {
//           controls.target.set(target.x, target.y, target.z);
//           controls.update(); // Update the controls to reflect new target position
//         }
//         //console.log(target); // Log to see if target values are updating
//       })
//       .onComplete(() => {
//         isCameraAnimating = false;
//         //console.log("Target animation complete");
//         addToAnimationArray();
//         checkAllAnimationsCompleted();
//         //addHotSpots();
//       });

//     // const tweenPosition = gsap.to(camera.position, {
//     //   ...newPosition,
//     //   duration: 1,
//     //   onUpdate: () => {},
//     //   onComlete: () => {
//     //     addToAnimationArray();
//     //     checkAllAnimationsCompleted();
//     //   },
//     // });
//     const fovObject = { fov: camera.fov }; // Wrap fov in an object
//     const endFov = 25;

//     const fovTweenIn = new TWEEN.Tween(fovObject, tweenGroup)
//       .to({ fov: endFov }, 1250) // Target the fov property in the object
//       .easing(TWEEN.Easing.Cubic.InOut)
//       .onUpdate(() => {
//         camera.fov = fovObject.fov; // Update the camera's fov
//         camera.updateProjectionMatrix(); // Important: Update the projection matrix after changing fov
//       })
//       .onComplete(() => {
//         addToAnimationArray();
//         checkAllAnimationsCompleted();
//         //camera.fov = 50; // Reset to the desired fov after the tween
//         camera.updateProjectionMatrix(); // Ensure the matrix is updated
//       });

//     const fovTweenOut = new TWEEN.Tween(fovObject, tweenGroup)
//       .to({ fov: 50 }, 1250) // Target the fov property in the object
//       .easing(TWEEN.Easing.Cubic.InOut)
//       .onUpdate(() => {
//         camera.fov = fovObject.fov; // Update the camera's fov
//         camera.updateProjectionMatrix(); // Important: Update the projection matrix after changing fov
//       })
//       .onComplete(() => {
//         addToAnimationArray();
//         checkAllAnimationsCompleted();
//         //camera.fov = 50; // Reset to the desired fov after the tween
//         camera.updateProjectionMatrix(); // Ensure the matrix is updated
//       });

//     // let pos = camera.position;
//     // const positionTween = new TWEEN.Tween(pos, tweenGroup)
//     //   .to({ ...newPosition }, 2500)
//     //   .easing(TWEEN.Easing.Cubic.InOut)
//     //   .onUpdate(() => {
//     //     camera.position.set(pos.x, pos.y, pos.z);
//     //   })
//     //   .onComplete(() => {
//     //     addToAnimationArray();
//     //     checkAllAnimationsCompleted();
//     //     //console.log("abc");
//     //   });

//     // if (newRotation != null) {
//     //   const tweenRotation = gsap.to(camera.rotation, {
//     //     ...newRotation,
//     //     duration: 1,
//     //     onUpdate: () => { },
//     //     onComlete: () => {
//     //       addToAnimationArray();
//     //       checkAllAnimationsCompleted();
//     //     },
//     //   });
//     // }

//     cameraTargetTweenIn.chain(cameraTargetTweenOut);
//     cameraTargetTweenIn.start();
//     //positionTween.start();
//     fovTweenIn.chain(fovTweenOut);
//     fovTweenIn.start();
//   });
// };

export { tweenCameraToNewPositionAndRotation };
