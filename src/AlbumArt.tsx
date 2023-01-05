import React from "react";
import { TrackData } from "./Types";
import AlbumArtSmall from "./AlbumArtSmall";
import AlbumArtLarge from "./AlbumArtLarge";

function AlbumArt(props: { track: TrackData }) {
  const [width, setWidth] = React.useState(window.innerWidth);
  const breakpoint = 505;

  let baseUrl = "/years/" + props.track.year;

  React.useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  return width < breakpoint ? (
    <AlbumArtSmall track={props.track} width={width} baseUrl={baseUrl} />
  ) : (
    <AlbumArtLarge width={width} baseUrl={baseUrl} />
  );
}

export default AlbumArt;
