import Globals from "./Globals";
import { YearData } from "./Types";

function Links(props: { data: YearData }) {
  let downloadLink = Globals.S3_PREFIX + props.data.year + "/" + props.data.title + ".zip";
  return (
    <div>
      <a href={downloadLink}>
        <img src="/images/download-icon-white-32x32.png"></img>
      </a>
      <a href={props.data.spotify}>
        <img src="/images/spotify-icon-white-32x32.png"></img>
      </a>
    </div>
  );
}

export default Links;
