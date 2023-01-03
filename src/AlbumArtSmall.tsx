import "./AlbumArtSmall.css";
import { YearData } from "./Types";
import { MouseEvent } from "react";
import Globals from "./Globals";
import Logger from "./Logger";

function AlbumArtSmall(props: {
  data: YearData;
  width: number;
  baseUrl: string;
}) {
  function handleClick(e: MouseEvent) {
    const img = e.target as HTMLImageElement;
    if (img.src.endsWith(Globals.FRONT_IMG)) {
      img.src = props.baseUrl + "/" + Globals.BACK_IMG;
    } else {
      img.src = props.baseUrl + "/" + Globals.FRONT_IMG;
    }
    Logger.log("AlbumArtSmall", "click", img.src, props.data.year);
  }

  return (
    <div className="AlbumArtSmall">
      <img
        src={`${props.baseUrl}/${Globals.FRONT_IMG}`}
        width={props.width}
        onClick={(e) => handleClick(e)}
        alt="album art"
      />
    </div>
  );
}

export default AlbumArtSmall;
