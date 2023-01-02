import { YearData } from "./Types";

function AlbumArt(props: {data: YearData}) {
  return (
    <div>
      <img src={`${process.env.PUBLIC_URL}/years/${props.data.year}/back.jpg`} />
      <img src={`${process.env.PUBLIC_URL}/years/${props.data.year}/front.jpg`} />
    </div>
  );
}

export default AlbumArt;
