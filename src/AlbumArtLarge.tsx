import './AlbumArtLarge.css';
import { YearData } from "./Types";

function AlbumArtLarge(props: {data: YearData, width: number}) {

  let baseUrl = process.env.PUBLIC_URL + "/years/" + props.data.year;
  let imgWidth = Math.min(props.width, 900) / 2

  return (
    <div className="AlbumArtLarge">
      <img src={`${baseUrl}/back.jpg`} width={imgWidth} />
      <img src={`${baseUrl}/front.jpg`} width={imgWidth} />
    </div>
  );
}

export default AlbumArtLarge;
