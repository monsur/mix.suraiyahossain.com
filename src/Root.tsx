import { useEffect, useState, useRef } from "react";
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
  const [prevTracks, setPrevTracks] = useState(tracks);

  // Reset track position synchronously when tracks change so that the very
  // first render with new data never reads an out-of-bounds index.
  let safeTrackPos = currentTrackPos;
  if (prevTracks !== tracks) {
    setPrevTracks(tracks);
    setCurrentTrackPos(0);
    safeTrackPos = 0;
  }

  const currentTrack = tracks[safeTrackPos];
  const textColor = Globals.ENABLE_DYNAMIC_COLORS
    ? currentTrack.textColor
    : "#ffffff";

  let nextTrack: TrackData | null = null;
  if (safeTrackPos < tracks.length - 1) {
    nextTrack = tracks[safeTrackPos + 1];
  }

  useEffect(() => {
    document.title = currentTrack.mixTitle;
    if (Globals.ENABLE_DYNAMIC_COLORS) {
      document.body.style.backgroundColor = currentTrack.backgroundColor;
      document.body.style.backgroundImage = "none";
    }
  });

  const audioRef = useRef(new Audio());
  useEffect(() => {
    if (!Globals.ENABLE_NEXT_TRACK_PRELOAD) {
      // TODO: Track preloading needs more debugging before its ready.
      return;
    }
    if (nextTrack != null) {
      const nextTrackUrl = nextTrack.url;
      const timeoutId = setTimeout(function () {
        audioRef.current.src = nextTrackUrl;
        audioRef.current.load();
      }, Globals.NEXT_TRACK_PRELOAD_SECONDS * 1000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [nextTrack]);

  return (
    <div>
      <AlbumArt track={currentTrack} />
      <Player
        tracks={tracks}
        currentTrackPos={safeTrackPos}
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
