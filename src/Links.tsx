import Globals from "./Globals";
import { YearData } from "./Types";
import downloadIcon from "./assets/download.png";
import spotifyIcon from "./assets/spotify.png";
import "./Links.css";
import Logger from "./Logger";

function Links(props: { data: YearData }) {
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

  return (
    <div className="Links">
      <a href={downloadLink}>
        <img
          src={downloadIcon}
          className="icon"
          alt="download"
          onClick={handleDownloadClick}
        ></img>
      </a>
      <a href={props.data.spotify}>
        <img
          src={spotifyIcon}
          className="icon"
          alt="spotify"
          onClick={handleSpotifyClick}
        ></img>
      </a>
    </div>
  );
}

export default Links;
