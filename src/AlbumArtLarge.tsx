import "./AlbumArtLarge.css";
import { YearData } from "./Types";
import Globals from "./Globals";

function AlbumArtLarge(props: {
  data: YearData;
  width: number;
  baseUrl: string;
}) {
  let imgWidth = Math.min(props.width, 900) / 2;

  return (
    <div className="AlbumArtLarge">
      <img src={`${props.baseUrl}/${Globals.BACK_IMG}`} width={imgWidth} alt="album art back" />
      <img src={`${props.baseUrl}/${Globals.FRONT_IMG}`} width={imgWidth} alt="album art front" />
    </div>
  );
}

export default AlbumArtLarge;
