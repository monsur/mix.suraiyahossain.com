import './AlbumArtSmall.css';
import { YearData } from "./Types";

function AlbumArtSmall(props: {data: YearData, width: number, baseUrl: string}) {

  return (
    <div className="AlbumArtSmall">
      <img src={`${props.baseUrl}/front.jpg`} width={props.width} />
    </div>
  );
}

export default AlbumArtSmall;
