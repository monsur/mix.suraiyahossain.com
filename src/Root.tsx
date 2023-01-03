import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { YearData } from "./Types";
import AlbumArt from "./AlbumArt";
import Navigation from "./Navigation";
import TrackInfo from "./TrackInfo";
import Globals from "./Globals";

function Root() {
  const data = useLoaderData() as YearData;
  const [currentTrack, setCurrentTrack] = useState(data.tracks[0]);
  const [nextTrack, setNextTrack] = useState(data.tracks[1]);

  useEffect(() => {
    document.title = data.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <AlbumArt data={data} />
      <TrackInfo currentTrack={currentTrack} nextTrack={nextTrack} />
      <Navigation
        minYear={Globals.MIN_YEAR}
        maxYear={Globals.MAX_YEAR}
      ></Navigation>
    </div>
  );
}

export default Root;
