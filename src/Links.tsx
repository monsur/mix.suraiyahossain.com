import Globals from "./Globals";
import { YearData } from "./Types";
import downloadIcon from "./assets/download.png";
import spotifyIcon from "./assets/spotify.png";
import "./Links.css";

function Links(props: { data: YearData }) {
  let downloadLink = Globals.S3_PREFIX + props.data.year + "/" + props.data.title + ".zip";
  return (
    <div className="Links">
      <a href={downloadLink}>
        <img src={downloadIcon} className="icon" alt="download"></img>
      </a>
      <a href={props.data.spotify}>
        <img src={spotifyIcon} className="icon" alt="spotify"></img>
      </a>
    </div>
  );
}

export default Links;
