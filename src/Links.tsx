import Globals from "./Globals";
import { YearData } from "./Types";
import "./Links.css";
import Logger from "./Logger";
import {ReactComponent as DownloadIcon} from "./assets/download.svg"
import {ReactComponent as SpotifyIcon} from "./assets/spotify.svg"

function Links(props: { data: YearData; textColor: string }) {
  let handleDownloadClick = () => {
    Logger.log("links", "action", "download", props.data.year);
    return true;
  };

  let handleSpotifyClick = () => {
    Logger.log("links", "action", "spotify", props.data.year);
    return true;
  };

  let downloadLink =
    Globals.S3_PREFIX + props.data.year + "/" + props.data.title + ".zip";

    let iconStyle = { width: "32px", fill: props.textColor, paddingRight: "20px" };

  return (
    <div className="Links">
      <a href={downloadLink}>
        <DownloadIcon style={iconStyle} onClick={handleDownloadClick} />
      </a>
      <a href={props.data.spotify}>
      <SpotifyIcon style={iconStyle} onClick={handleSpotifyClick} />
      </a>
    </div>
  );
}

export default Links;
