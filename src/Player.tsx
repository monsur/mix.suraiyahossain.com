import { YearData } from "./Types";
import { useState, useRef, useEffect } from "react";
import Globals from "./Globals";
import nextIcon from "./assets/nexttrack.png";
import prevIcon from "./assets/prevtrack.png";
import playIcon from "./assets/play.png";
import pauseIcon from "./assets/pause.png";
import "./Player.css";
import Logger from "./Logger";

function Player(props: {
  data: YearData;
  currentTrackPos: number;
  setCurrentTrackPos: Function;
}) {
  let currentTrack = props.data.tracks[props.currentTrackPos];
  const [isPlaying, setIsPlaying] = useState(false);

  const getTrackUrl = (src: string) => {
    return Globals.S3_PREFIX + props.data.year + "/tracks/" + src;
    //return "testtrack.mp3";
  }

  const audioRef = useRef(new Audio());
  audioRef.current.onended = () => { 
    let oldTrackPos = props.currentTrackPos + 1;
    if (oldTrackPos < props.data.tracks.length) {
      props.setCurrentTrackPos(oldTrackPos);
    } else {
      setIsPlaying(false);
      props.setCurrentTrackPos(0);
    }
  };

  const handleNext = () => {
    let pos = props.currentTrackPos;
    if (pos < props.data.tracks.length - 1) {
      pos++;
    }
    props.setCurrentTrackPos(pos);
    Logger.log("Player", "click", "next", props.data.year);
  };

  const handlePrev = () => {
    let pos = props.currentTrackPos;
    if (pos > 0) {
      pos--;
    }
    props.setCurrentTrackPos(pos);
    Logger.log("Player", "click", "prev", props.data.year);
  };

  const handlePlayPause = (val: boolean) => {
    setIsPlaying(val);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      Logger.log("Player", "click", "play", props.data.year);
    } else {
      audioRef.current.pause();
      Logger.log("Player", "click", "pause", props.data.year);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.pause();
    }

    let trackSrc = getTrackUrl(currentTrack.src);
    audioRef.current.src = trackSrc;
    Logger.log("Player", "track", trackSrc, props.data.year);

    if (isPlaying) {
      audioRef.current.play();
    }
  }, [currentTrack]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
    };
  });

  return (
    <div className="Player">
      <img
        className="prevTrack"
        alt="previous track"
        title="previous track"
        src={prevIcon}
        onClick={handlePrev}
      />
      {isPlaying ? (
        <img
          className="playPause"
          alt="pause"
          title="pause"
          src={pauseIcon}
          onClick={() => handlePlayPause(false)}
        />
      ) : (
        <img
          className="playPause"
          alt="play"
          title="play"
          src={playIcon}
          onClick={() => handlePlayPause(true)}
        />
      )}
      <img
        className="nextTrack"
        alt="next track"
        title="next track"
        src={nextIcon}
        onClick={handleNext}
      />
    </div>
  );
}

export default Player;
