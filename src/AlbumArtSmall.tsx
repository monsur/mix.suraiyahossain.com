import React from 'react';
import { YearData } from "./Types";

function AlbumArtSmall(props: {data: YearData}) {

  let baseUrl = process.env.PUBLIC_URL + "/years/" + props.data.year;

  return (
    <div>
      <img src={`${baseUrl}/front.jpg`} />
    </div>
  );
}

export default AlbumArtSmall;
