import "./AlbumArtLarge.css";
import { TrackData } from "./Types";

function AlbumArtLarge(props: { track: TrackData; width: number }) {
  const backImgStyle = { marginRight: 20 };
  const imgWidth = (Math.min(props.width, 900) - backImgStyle.marginRight) / 2;

  return (
    <div className="AlbumArtLarge">
      <img
        src={props.track.albumArtBack}
        width={imgWidth}
        alt="album art back"
        style={backImgStyle}
      />
      <img
        src={props.track.albumArtFront}
        width={imgWidth}
        alt="album art front"
      />
    </div>
  );
}

export default AlbumArtLarge;
