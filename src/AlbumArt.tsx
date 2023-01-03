import React from "react";
import { YearData } from "./Types";
import AlbumArtSmall from "./AlbumArtSmall";
import AlbumArtLarge from "./AlbumArtLarge";

function AlbumArt(props: { data: YearData }) {
  const [width, setWidth] = React.useState(window.innerWidth);
  const breakpoint = 505;

  let baseUrl = "/years/" + props.data.year;

  React.useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  return width < breakpoint ? (
    <AlbumArtSmall data={props.data} width={width} baseUrl={baseUrl} />
  ) : (
    <AlbumArtLarge data={props.data} width={width} baseUrl={baseUrl} />
  );
}

export default AlbumArt;
