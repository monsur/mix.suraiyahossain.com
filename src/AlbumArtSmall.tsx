import './AlbumArtSmall.css';
import { YearData } from "./Types";

function AlbumArtSmall(props: {data: YearData, width: number}) {

  let baseUrl = process.env.PUBLIC_URL + "/years/" + props.data.year;

  return (
    <div className="AlbumArtSmall">
      <img src={`${baseUrl}/front.jpg`} width={props.width} />
    </div>
  );
}

export default AlbumArtSmall;
