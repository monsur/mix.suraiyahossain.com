import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { YearData } from "./Types";
import AlbumArt from "./AlbumArt";
import Navigation from "./Navigation";
import TrackInfo from "./TrackInfo";
import Globals from "./Globals";
import Player from "./Player";

function Root() {
  const data = useLoaderData() as YearData;
  const [currentTrackPos, setCurrentTrackPos] = useState(0);

  let currentTrack = data.tracks[currentTrackPos];

  let nextTrack = null;
  if (currentTrackPos < data.tracks.length - 1) {
    nextTrack = data.tracks[currentTrackPos + 1];
  }

  useEffect(() => {
    document.title = data.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <AlbumArt data={data} />
      <Player tracks={data.tracks} currentTrackPos={currentTrackPos} setCurrentTrackPos={setCurrentTrackPos}></Player>
      <TrackInfo currentTrack={currentTrack} nextTrack={nextTrack} />
      <Navigation
        minYear={Globals.MIN_YEAR}
        maxYear={Globals.MAX_YEAR}
      ></Navigation>
    </div>
  );
}

export default Root;
