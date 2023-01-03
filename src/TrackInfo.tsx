import { TrackData } from "./Types";
import "./TrackInfo.css";

function TrackInfo(props: { currentTrack: TrackData; nextTrack: TrackData }) {
  let nextTrackDetails = "";
  if (props.nextTrack) {
    nextTrackDetails = props.nextTrack.title + " - " + props.nextTrack.artist;
  }
  return (
    <div className="TrackInfo">
      <div className="TrackInfoTitle">{props.currentTrack.title}</div>
      <div className="TrackInfoArtist">{props.currentTrack.artist}</div>
      <div className="TrackInfoDetails">{nextTrackDetails}</div>
    </div>
  );
}

export default TrackInfo;
