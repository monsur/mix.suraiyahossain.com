import "./AlbumArtSmall.css";
import { TrackData } from "./Types";
import { useState } from "react";
import Logger from "./Logger";

function AlbumArtSmall(props: { track: TrackData; width: number }) {
  const [showFront, setShowFront] = useState(true);

  function handleClick(): void {
    const next = !showFront;
    setShowFront(next);
    const src = next ? props.track.albumArtFront : props.track.albumArtBack;
    Logger.log("AlbumArtSmall", "click", src, props.track.year);
  }

  return (
    <div className="AlbumArtSmall">
      <img
        src={showFront ? props.track.albumArtFront : props.track.albumArtBack}
        width={props.width}
        onClick={handleClick}
        alt="album art"
      />
    </div>
  );
}

export default AlbumArtSmall;
