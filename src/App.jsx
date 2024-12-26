import { useState } from "react";
import "./App.css";

import PanoramaViewer from "./components/panoramaViewer";

function App() {
  return (
    <>
      <PanoramaViewer imageUrl="../../public/pano_images/DJI_0022 - 150.JPG" />
    </>
  );
}

export default App;
