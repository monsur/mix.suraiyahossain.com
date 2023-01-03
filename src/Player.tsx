import { YearData } from "./Types";
import { useState, useRef, useEffect } from "react";

function Player(props: {
  data: YearData;
  currentTrackPos: number;
  setCurrentTrackPos: Function;
}) {
  let currentTrack = props.data.tracks[props.currentTrackPos];
  let trackSrc =
    "https://s3.amazonaws.com/mix.suraiyahossain.com/" +
    props.data.year +
    "/tracks/" +
    currentTrack.src;
  const audioRef = useRef(new Audio(trackSrc));
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

    audioRef.current = new Audio(trackSrc);

    if (isPlaying) {
      audioRef.current.play();
    }
  }, [currentTrack]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      //clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div>
      <img
        className="prevTrack"
        alt="previous track"
        title="previous track"
        src="/images/prevtrack.png"
        onClick={handlePrev}
      />
      {isPlaying ? (
        <img
          className="playPause"
          alt="pause"
          title="pause"
          src="/images/pause.png"
          onClick={() => handlePlayPause(false)}
        />
      ) : (
        <img
          className="playPause"
          alt="play"
          title="play"
          src="/images/play.png"
          onClick={() => handlePlayPause(true)}
        />
      )}
      <img
        className="nextTrack"
        alt="next track"
        title="next track"
        src="/images/nexttrack.png"
        onClick={handleNext}
      />
    </div>
  );
}

export default Player;
