import { TrackData } from "./Types";
import "./TrackInfo.css";

function TrackInfo(props: {
  textColor: string;
  currentTrack: TrackData;
  nextTrack: TrackData | null;
}) {
  let nextTrackDetails = "";
  if (props.nextTrack) {
    nextTrackDetails =
      "Next: " + props.nextTrack.title + " - " + props.nextTrack.artist;
  }

  const style = { color: props.textColor };

  return (
    <div className="TrackInfo">
      <div className="TrackInfoTitle" style={style}>
        {props.currentTrack.title}
      </div>
      <div className="TrackInfoArtist" style={style}>
        {props.currentTrack.artist}
      </div>
      <div className="TrackInfoDetails" style={style}>
        {nextTrackDetails}
      </div>
    </div>
  );
}

export default TrackInfo;
