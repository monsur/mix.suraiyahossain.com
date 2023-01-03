import React from "react";
import { YearData } from "./Types";
import AlbumArtSmall from "./AlbumArtSmall";
import AlbumArtLarge from "./AlbumArtLarge";

function AlbumArt(props: { data: YearData }) {
  const [width, setWidth] = React.useState(window.innerWidth);
  const breakpoint = 505;

  let baseUrl = process.env.PUBLIC_URL + "/years/" + props.data.year;

  React.useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  return width < breakpoint ? (
    <AlbumArtSmall data={props.data} width={width} />
  ) : (
    <AlbumArtLarge data={props.data} width={width} />
  );
}

export default AlbumArt;
