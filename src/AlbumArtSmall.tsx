import "./AlbumArtSmall.css";
import { TrackData } from "./Types";
import { MouseEvent } from "react";
import Logger from "./Logger";
import UrlHelper from "./UrlHelper";

function AlbumArtSmall(props: { track: TrackData; width: number }) {
  function handleClick(e: MouseEvent): void {
    const img = e.target as HTMLImageElement;
    if (img.src.endsWith(UrlHelper.FRONT_IMG)) {
      img.src = props.track.albumArtBack;
    } else {
      img.src = props.track.albumArtFront;
    }
    Logger.log("AlbumArtSmall", "click", img.src, props.track.year);
  }

  return (
    <div className="AlbumArtSmall">
      <img
        src={props.track.albumArtFront}
        width={props.width}
        onClick={(e) => handleClick(e)}
        alt="album art"
      />
    </div>
  );
}

export default AlbumArtSmall;
