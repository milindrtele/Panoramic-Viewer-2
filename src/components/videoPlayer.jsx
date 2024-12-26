import { useEffect, useRef } from "react";

const VideoPlayer = (props) => {
  const node = useRef();
  const playerRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (node.current && !node.current.contains(event.target)) {
      console.log("CLICKED OUTSIDE!");
      stopVideo();
      props.clickedOutside();
    }
  };

  useEffect(() => {
    const initializePlayer = () => {
      if (window.YT && window.YT.Player) {
        createPlayer(); // Create the player directly if the API is already loaded
      } else {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
          console.log("YouTube Iframe API is ready");
          createPlayer();
        };
      }
    };

    initializePlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [props.videoSrcID]);

  const createPlayer = () => {
    if (playerRef.current) {
      playerRef.current.destroy(); // Destroy the existing player to avoid conflicts
    }

    playerRef.current = new YT.Player("player", {
      height: "390",
      width: "640",
      videoId: props.videoSrcID || "esWJ3uXxZaY",
      playerVars: {
        playsinline: 1,
        controls: 0,
        enablejsapi: 1,
      },
      events: {
        onReady: onPlayerReady,
        //onStateChange: onPlayerStateChange,
      },
    });
  };

  function onPlayerReady(event) {
    event.target.playVideo();
    document.addEventListener("click", handleOutsideClick);
  }

  let done = false;
  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo, 6000);
      done = true;
    } else if (event.data === YT.PlayerState.ENDED) {
      done = false;
    }
  }

  function stopVideo() {
    playerRef.current && playerRef.current.stopVideo();
  }

  return (
    <div ref={node} className="video_player_container">
      <div id="player"></div>
    </div>
  );
};

export default VideoPlayer;
