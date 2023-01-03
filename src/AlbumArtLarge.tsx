import './AlbumArtLarge.css';
import { YearData } from "./Types";

function AlbumArtLarge(props: {data: YearData, width: number, baseUrl: string}) {

  let imgWidth = Math.min(props.width, 900) / 2

  return (
    <div className="AlbumArtLarge">
      <img src={`${props.baseUrl}/back.jpg`} width={imgWidth} />
      <img src={`${props.baseUrl}/front.jpg`} width={imgWidth} />
    </div>
  );
}

export default AlbumArtLarge;
