import { useEffect, useRef } from "react";

const MatterPortViewer = (props) => {

  return (
    <div className="matterport_player_container">
        <div id="close_matterport" className="close_matterport" onClick={()=>{props.closeClicked()}}></div>
      <iframe src="https://my.matterport.com/show/?m=Z6fTNQsPxPG">
      </iframe>
    </div>
  );
};

export default MatterPortViewer;
