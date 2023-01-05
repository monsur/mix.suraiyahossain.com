import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { TrackData } from "./Types";
import AlbumArt from "./AlbumArt";
import Navigation from "./Navigation";
import TrackInfo from "./TrackInfo";
import Globals from "./Globals";
import Player from "./Player";
import Links from "./Links";

function Root() {
  const tracks = useLoaderData() as TrackData[];
  const [currentTrackPos, setCurrentTrackPos] = useState(0);

  let currentTrack = tracks[currentTrackPos];
  let textColor = Globals.ENABLE_DYNAMIC_COLORS ? currentTrack.textColor : "#ffffff";

  let nextTrack = null;
  if (currentTrackPos < tracks.length - 1) {
    nextTrack = tracks[currentTrackPos + 1];
  }

  useEffect(() => {
    document.title = currentTrack.mixTitle;
    if (Globals.ENABLE_DYNAMIC_COLORS) {
      document.body.style.backgroundColor = currentTrack.backgroundColor;
      document.body.style.backgroundImage = "none";
    }
  });

  useEffect(() => {
    setCurrentTrackPos(0);
  }, [tracks]);

  return (
    <div>
      <AlbumArt track={currentTrack} />
      <Player
        tracks={tracks}
        currentTrackPos={currentTrackPos}
        setCurrentTrackPos={setCurrentTrackPos}
        textColor={textColor}
      ></Player>
      <TrackInfo
        textColor={textColor}
        currentTrack={currentTrack}
        nextTrack={nextTrack}
      />
      <Links track={currentTrack} textColor={textColor}></Links>
      <Navigation
        textColor={textColor}
        minYear={Globals.MIN_YEAR}
        maxYear={Globals.MAX_YEAR}
      ></Navigation>
    </div>
  );
}

export default Root;
