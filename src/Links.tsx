import { TrackData } from "./Types";
import "./Links.css";
import Logger from "./Logger";
import { ReactComponent as DownloadIcon } from "./assets/download.svg";
import { ReactComponent as SpotifyIcon } from "./assets/spotify.svg";

function Links(props: { track: TrackData; textColor: string }) {
  function handleDownloadClick(): boolean {
    Logger.log("links", "action", "download", props.track.year);
    return true;
  };

  function handleSpotifyClick(): boolean {
    Logger.log("links", "action", "spotify", props.track.year);
    return true;
  }

  let iconStyle = {
    width: "24px",
    fill: props.textColor,
    paddingRight: "20px",
  };

  return (
    <div className="Links">
      <a href={props.track.downloadUrl}>
        <DownloadIcon style={iconStyle} onClick={handleDownloadClick} />
      </a>
      <a href={props.track.spotify}>
        <SpotifyIcon style={iconStyle} onClick={handleSpotifyClick} />
      </a>
    </div>
  );
}

export default Links;
