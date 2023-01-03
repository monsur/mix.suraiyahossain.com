import "./AlbumArtLarge.css";
import { YearData } from "./Types";
import Globals from "./Globals";

function AlbumArtLarge(props: {
  data: YearData;
  width: number;
  baseUrl: string;
}) {
  // Keep this in sync with .back.margin-right in the css file.
  // e.g. if margin-right is 20px, subtract 20/2 = 10px below.
  let imgWidth = (Math.min(props.width, 900) - 10) / 2;

  return (
    <div className="AlbumArtLarge">
      <img src={`${props.baseUrl}/${Globals.BACK_IMG}`} width={imgWidth} alt="album art back" className="back" />
      <img src={`${props.baseUrl}/${Globals.FRONT_IMG}`} width={imgWidth} alt="album art front" />
    </div>
  );
}

export default AlbumArtLarge;
