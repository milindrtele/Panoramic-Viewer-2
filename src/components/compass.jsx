import { useEffect, useRef } from "react";

const Compass = (props) => {
  const compassRef = useRef(null);
  const needleRef = useRef(null);
  useEffect(() => {
    compassRef.current = document.getElementById("compass");
    needleRef.current = document.getElementById("needle");
  }, []);

  useEffect(() => {
    changeFov(props.fov);
  }, [props.fov]);

  useEffect(() => {
    changeAngle(360 - (props.angle * 180) / Math.PI - 70 - props.fov / 2);
  }, [props.angle, props.fov]);

  function changeAngle(angle) {
    const Rangle = `${angle}deg`; // Set the angle dynamically based on the `fov` parameter
    needleRef.current.style.transform = `rotate(${Rangle})`;
  }

  function changeFov(fov) {
    const angle = `${fov}deg`; // Set the angle dynamically based on the `fov` parameter
    needleRef.current.style.background = `conic-gradient(
    rgba(31, 31, 31, 0.725) ${angle},
    #ffffff00 6deg 18deg
  )`;
  }

  return (
    <div className="compass_parent">
      <div className="compass_container">
        <div id="compass" className="compass"></div>
        <div id="needle" className="needle"></div>
      </div>

      <div className="powered_by_metavian">
        <p>Powered by </p>
        <a href="https://metavian.tech/" target="_blank">
          <p className="metavian_text"> Metavian</p>
        </a>
      </div>
    </div>
  );
};

export default Compass;
