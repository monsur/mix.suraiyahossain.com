import { TrackData } from "./Types";
import { useState, useRef, useEffect } from "react";
import { ReactComponent as NextIcon } from "./assets/nexttrack.svg";
import { ReactComponent as PrevIcon } from "./assets/prevtrack.svg";
import { ReactComponent as PlayIcon } from "./assets/play.svg";
import { ReactComponent as PauseIcon } from "./assets/pause.svg";
import "./Player.css";
import Logger from "./Logger";

function Player(props: {
  tracks: TrackData[];
  currentTrackPos: number;
  setCurrentTrackPos: Function;
  textColor: string;
}) {
  let currentTrack = props.tracks[props.currentTrackPos];
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(new Audio());
  audioRef.current.onended = () => {
    let oldTrackPos = props.currentTrackPos + 1;
    if (oldTrackPos < props.tracks.length) {
      props.setCurrentTrackPos(oldTrackPos);
    } else {
      setIsPlaying(false);
      props.setCurrentTrackPos(0);
    }
  };

  function handleNext(): void {
    let pos = props.currentTrackPos;
    if (pos < props.tracks.length - 1) {
      pos++;
    }
    props.setCurrentTrackPos(pos);
    Logger.log("Player", "click", "next", currentTrack.year);
  }

  function handlePrev(): void {
    let pos = props.currentTrackPos;
    if (pos > 0) {
      pos--;
    } else {
      // Already at the first track, reset time to zero.
      audioRef.current.currentTime = 0;
    }
    props.setCurrentTrackPos(pos);
    Logger.log("Player", "click", "prev", currentTrack.year);
  }

  function handlePlayPause(val: boolean): void {
    setIsPlaying(val);
    let label = val ? "play" : "pause";
    Logger.log("Player", "click", label, currentTrack.year);
  }

  function play(): void {
    audioRef.current.play().catch((e) => {
      if ("name" in e && e.name === "AbortError") {
        // Ignore the error, since this is most likely due to user
        // navigating away before the play() function as competed.
        // Revisit this if there are other valid use cases that are
        // being ignored.
      } else {
        throw e;
      }
    });
  }

  function pause(): void {
    audioRef.current.pause();
  }

  useEffect(() => {
    if (isPlaying) {
      play();
    } else {
      pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      pause();
    }

    audioRef.current.src = currentTrack.url;
    Logger.log("Player", "track", currentTrack.url, currentTrack.year);

    if (isPlaying) {
      play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      pause();
    };
  });

  let iconStyle = { width: "50px", fill: props.textColor };

  return (
    <div className="Player">
      <PrevIcon style={iconStyle} onClick={handlePrev} />
      <span className="playPause">
        {isPlaying ? (
          <PauseIcon style={iconStyle} onClick={() => handlePlayPause(false)} />
        ) : (
          <PlayIcon style={iconStyle} onClick={() => handlePlayPause(true)} />
        )}
      </span>
      <NextIcon style={iconStyle} onClick={handleNext} />
    </div>
  );
}

export default Player;
