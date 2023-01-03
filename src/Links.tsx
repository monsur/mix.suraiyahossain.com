import Globals from "./Globals";
import { YearData } from "./Types";
import downloadIcon from "./assets/download.png";
import spotifyIcon from "./assets/spotify.png";

function Links(props: { data: YearData }) {
  let downloadLink = Globals.S3_PREFIX + props.data.year + "/" + props.data.title + ".zip";
  return (
    <div>
      <a href={downloadLink}>
        <img src={downloadIcon}></img>
      </a>
      <a href={props.data.spotify}>
        <img src={spotifyIcon}></img>
      </a>
    </div>
  );
}

export default Links;
