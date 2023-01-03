import { YearData } from "./Types";
import { useState, useRef, useEffect } from "react";
import Globals from "./Globals";
import nextIcon from "./assets/nexttrack.png";
import prevIcon from "./assets/prevtrack.png";
import playIcon from "./assets/play.png";
import pauseIcon from "./assets/pause.png";

function Player(props: {
  data: YearData;
  currentTrackPos: number;
  setCurrentTrackPos: Function;
}) {
  let currentTrack = props.data.tracks[props.currentTrackPos];
  let year = props.data.year;
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNext = () => {
    let pos = props.currentTrackPos;
    if (pos < props.data.tracks.length - 1) {
      pos++;
    }
    props.setCurrentTrackPos(pos);
  };

  const handlePrev = () => {
    let pos = props.currentTrackPos;
    if (pos > 0) {
      pos--;
    }
    props.setCurrentTrackPos(pos);
  };

  const handlePlayPause = (val: boolean) => {
    setIsPlaying(val);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.pause();
    }

    audioRef.current.src =
      Globals.S3_PREFIX + year + "/tracks/" + currentTrack.src;

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
    <div>
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
