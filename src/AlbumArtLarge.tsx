import "./AlbumArtLarge.css";
import Globals from "./Globals";

function AlbumArtLarge(props: {
  width: number;
  baseUrl: string;
}) {
  const backImgStyle = { marginRight: 20 };
  let imgWidth = (Math.min(props.width, 900) - backImgStyle.marginRight) / 2;

  return (
    <div className="AlbumArtLarge">
      <img
        src={`${props.baseUrl}/${Globals.BACK_IMG}`}
        width={imgWidth}
        alt="album art back"
        style={backImgStyle}
      />
      <img
        src={`${props.baseUrl}/${Globals.FRONT_IMG}`}
        width={imgWidth}
        alt="album art front"
      />
    </div>
  );
}

export default AlbumArtLarge;
