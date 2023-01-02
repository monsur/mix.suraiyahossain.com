import React from 'react';
import { YearData } from "./Types";

function AlbumArtLarge(props: {data: YearData}) {

  let baseUrl = process.env.PUBLIC_URL + "/years/" + props.data.year;

  return (
    <div>
      <img src={`${baseUrl}/back.jpg`} />
      <img src={`${baseUrl}/front.jpg`} />
    </div>
  );
}

export default AlbumArtLarge;
